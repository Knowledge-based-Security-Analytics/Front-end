import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Statement, StatementDef } from '../models/statemet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private apollo: Apollo) {

  }

  public async getStatements(statementDef: StatementDef): Promise<Statement[]> {
    return new Promise(resolve => {
      this.apollo.query({
        query: gql`
            {
              statements{
                ${this.statementDefToGql(statementDef)}
              }
            }
          `
      }).subscribe(result => {
        resolve((result.data as any).statements);
      })
    });
  }

  /**
   * @returns {Promise<string>} The ID of the deployed Statement
   */
  public pushStatement(name: string, deploymentMode: string, eventType: boolean, eplStatement: string, blocklyXml: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.apollo.mutate({
        mutation: gql`
          mutation {
            deployStatement(
              data: {
                name: "${name}"
                deploymentMode: "${deploymentMode}"
                eventType: ${eventType}
                eplStatement: "${eplStatement}"
                blocklyXml: "${blocklyXml}"
              }
           ){deploymentId}
          }
        `
      }).subscribe(
        result => {
          resolve((result as any).data.deployStatement.deploymentId);
        },
        error => {
          reject(error);
        });
    });
  }

  public statementDefToGql(statementDef: StatementDef): string {
    let statementString: string = "";
    Object.keys(statementDef).forEach(key => {
      if (statementDef[key]) {
        statementString += key + "\n";
      }
    })
    return statementString;
  }
}
