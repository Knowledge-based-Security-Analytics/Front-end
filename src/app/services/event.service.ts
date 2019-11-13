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
    console.log("constr");
    
  }

  public async getStatements(statementDef: StatementDef): Promise<Statement[]>{
      return new Promise(resolve=>{ 
        this.apollo.query({
          query: gql`
            {
              statements{
                ${this.statementDefToGql(statementDef)}
              }
            }
          `
      }).subscribe(result =>{
        resolve((result.data as any).statements);
      })
    });
  }

  public statementDefToGql(statementDef: StatementDef): string{
    let statementString: string = "";
    Object.keys(statementDef).forEach(key =>{
      if(statementDef[key]){
        statementString += key + "\n";
      }
    })
    return statementString;
  }
}
