import { DocumentNode } from 'graphql';
import { Apollo } from 'apollo-angular';
import { StatementDef } from './statement-def';

export class GraphQLUtils {
  public static async mutate(gqlString: DocumentNode, apollo: Apollo): Promise<any> {
    return new Promise((resolve, reject) => {
      apollo.mutate({
        mutation: gqlString
      }).subscribe(
        result => {
          resolve((result as any).data);
        },
        error => {
          reject(error);
        });
    });
  }

  public static statementDefToGql(statementDef: StatementDef): string {
    let statementString = '';
    Object.keys(statementDef).forEach(key => {
      if (statementDef[key]) {
        statementString += key + '\n';
      }
    });
    return statementString;
  }
}
