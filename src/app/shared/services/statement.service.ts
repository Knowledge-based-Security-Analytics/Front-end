import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pattern, Schema, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { GraphQLStatementService } from '../graphql/services/graphql_statement.service';
import {
  frontendToBackendModelConverter,
  backendToFrontendDataModelConverter
} from '../graphql/models/backendStatementModel';

@Injectable({
  providedIn: 'root'
})
export class StatementService {
  private statements: (Pattern | Schema)[] = [];
  public statementsObservable = new BehaviorSubject<(Pattern | Schema)[]>(this.statements);

  constructor(private graphqlStatementService: GraphQLStatementService) { }


  public async getStatements(): Promise<(Pattern | Schema)[]> {
    return new Promise(async resolve => {
      this.statements = [];
      const tempStatements = await this.graphqlStatementService.getStatements({deploymentId: true,
                                                        deploymentDependencies: true,
                                                        deploymentMode: true,
                                                        eplStatement: true,
                                                        name: true,
                                                        description: true,
                                                        modified: true,
                                                        blocklyXml: true,
                                                        eventType: true,
                                                        objectRepresentation: true});
      tempStatements.map(statement => {
        this.statements.push(backendToFrontendDataModelConverter(statement));
      });
      this.statementsChanged();
      resolve(this.statements);
    });
  }

  /**
   * @returns The ID of the deployed Statement
   */
  public async pushStatement(newStatement: Pattern | Schema): Promise<string> {
    const backendStatementModel = frontendToBackendModelConverter(newStatement);
    return this.graphqlStatementService
      .pushStatement(
        backendStatementModel.eplStatement,
        backendStatementModel.blocklyXml,
        backendStatementModel.objectRepresentation,
        backendStatementModel.name,
        backendStatementModel.deploymentMode,
        backendStatementModel.eventType,
        backendStatementModel.description)
      .then(id => {
        newStatement.deploymentProperties.id = id;
        newStatement.lastModified = new Date().toISOString();
        this.statements.push(newStatement);
        this.statementsChanged();
        return id;
    });
  }

  /**
   * @returns The ID of the updated Statement
   */
  public async updateStatement(updatedStatement: Pattern | Schema): Promise<string> {
    const backendStatementModel = frontendToBackendModelConverter(updatedStatement);
    return this.graphqlStatementService
    .updateStatement(
      backendStatementModel.deploymentId,
      backendStatementModel.name,
      backendStatementModel.deploymentMode,
      backendStatementModel.eventType,
      backendStatementModel.eplStatement,
      backendStatementModel.blocklyXml,
      backendStatementModel.description,
      backendStatementModel.objectRepresentation)
    .then(id => {
      const i = this.statements.findIndex((statement: Pattern | Schema) =>
        statement.deploymentProperties.id === updatedStatement.deploymentProperties.id);
      updatedStatement.deploymentProperties.id = id;
      updatedStatement.lastModified = new Date().toISOString();
      this.statements[i] = updatedStatement;
      this.statementsChanged();
      return id;
    });
  }

  public async dropStatement(deploymentId: string): Promise<boolean> {
    return this.graphqlStatementService.dropStatement(deploymentId)
    .then(success => {
      if (success) {
        const i = this.statements.findIndex(statement => statement.deploymentProperties.id === deploymentId);
        this.statements.splice(i, 1);
        this.statementsChanged();
      }
      return success;
    });
  }

  public getStatement(deploymentId: string): Pattern | Schema {
    return this.statements.find(statement => statement.deploymentProperties.id === deploymentId);
  }

/*   private parseStatement(statement: Statement) {
    this.backendToFrontendDataModelConverter(statement);
    if (!statement.eplStatement) {
      return;
    }
    if (!statement.eplParsed) {
      statement.eplParsed = {};
    }

    if (statement.eplStatement.includes('@JsonSchema')) {
      statement.eplParsed.type = 'schema';

      statement.eplParsed.name = statement.eplStatement.match(/schema.*\(/)[0];
      statement.eplParsed.name = statement.eplParsed.name.slice(7, -5);

      statement.eplParsed.attributes = {};
      let eventDef = statement.eplStatement.match(/schema.*\(.*\)/)[0];
      eventDef = eventDef.match(/\(.*\)/)[0];
      eventDef = eventDef.slice(1, eventDef.length - 1);
      let attributes: string[] = [];
      attributes = eventDef.split(',');
      attributes.forEach(attribute => {
        attribute = attribute.trim();
        const keyValue = attribute.split(' ');
        statement.eplParsed.attributes[keyValue[0].trim()] = keyValue[1].trim();
      });
    } else if (statement.eplStatement.includes('@KafkaOutput')) {
      statement.eplParsed.type = 'pattern';

      statement.eplParsed.name = statement.eplStatement.match(/\'.*\'/)[0];
      statement.eplParsed.name = statement.eplParsed.name
        .split('@')[1]
        .slice(13, -1);
    }
  } */

  private statementsChanged() {
    this.statementsObservable.next(this.statements);
  }
}
