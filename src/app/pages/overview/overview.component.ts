import { Component, OnInit } from '@angular/core';
import { Schema, Pattern, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { StatementService } from 'src/app/shared/services/statement.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  schemaStatements: Schema[];
  patternStatements: Pattern[];
  loading = false;
  selectedStatement: Schema | Pattern;

  constructor(private stmtService: StatementService) {
    this.stmtService.statementsObservable.subscribe(statements => {
      this.loading = true;
      this.schemaStatements = statements.filter(statement => Statement.isSchema(statement)) as Schema[];
      this.patternStatements = statements.filter(statement => !Statement.isSchema(statement)) as Pattern[];
      if (this.schemaStatements.length >= 0 || this.patternStatements.length >= 0) {
        this.loading = false;
      }
    });
   }

  ngOnInit() {
    if (this.schemaStatements.length === 0 || this.patternStatements.length === 0) {
      this.stmtService.getStatements();
    }
  }

  statementSelected(statement: Pattern | Schema) {
    this.selectedStatement = statement;
  }

  statementUnselect() {
    this.selectedStatement = null;
  }

  // public onAlert(count: number, alertedStatement: Statement) {
  //   for (const statement of this.rawStatements) {
  //     if (statement.deploymentId === alertedStatement.deploymentId) {
  //       statement.alertCount = alertedStatement.alertCount;
  //     }
  //   }
  // }
}
