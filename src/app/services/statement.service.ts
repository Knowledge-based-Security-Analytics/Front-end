import { GraphQLUtils } from './graphql_utils';
import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Statement, StatementDef } from '../models/statemet';
import { DocumentNode } from 'apollo-link';

@Injectable({
  providedIn: 'root'
})
export class StatementService {

  constructor(private apollo: Apollo) {

  }

  public async getStatements(statementDef: StatementDef): Promise<Statement[]> {
    return new Promise(resolve => {
      this.apollo.query({
        query: gql`
            {
              statements{
                ${GraphQLUtils.statementDefToGql(statementDef)}
              }
            }
          `
      }).subscribe(result => {
        resolve((result.data as any).statements);
      });
    });
  }

  /**
   * @returns The ID of the deployed Statement
   */
  public async pushStatement(eplStatement: string, blocklyXml: string, name?: string,
                             deploymentMode?: string, eventType?: boolean): Promise<string> {
    const gqlString = gql`
      mutation {
        deployStatement(
          data: {
            ${name ? `name: "${name}"` : ''}
            ${deploymentMode ? `deploymentMode: "${deploymentMode}"` : ''}
            ${eventType !== undefined ? `eventType: ${eventType}` : ''}
            eplStatement: "${eplStatement}"
            blocklyXml: "${blocklyXml}"
          }
        ){deploymentId}
      }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).deployStatement.deploymentId;
  }

  /**
   * @returns The ID of the updated Statement
   */
  public async updateStatement(deploymentId: string, name?: string, deploymentMode?: string,
                               eventType?: boolean, eplStatement?: string, blocklyXml?: string): Promise<string> {
    const gqlString = gql`
      mutation {
        redeployStatement(
          data: {
            ${name ? `name: "${name}"` : ''}
            ${deploymentMode ? `deploymentMode: "${deploymentMode}"` : ''}
            ${eventType !== undefined ? `eventType: ${eventType}` : ''}
            deploymentId: "${deploymentId}"
            ${eplStatement ? `eplStatement: "${eplStatement}"` : ''}
            ${blocklyXml ? `blocklyXml: "${blocklyXml}"` : ''}
          }
        ){deploymentId}
      }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).redeployStatement.deploymentId;
  }

  public async dropStatement(deploymentId: string): Promise<boolean> {
    const gqlString = gql`
        mutation {
          undeployStatement(
              deploymentId: "${deploymentId}"
          )
        }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).undeployStatement;
  }
}

