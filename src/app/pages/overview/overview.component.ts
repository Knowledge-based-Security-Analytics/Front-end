import { Component, OnInit } from '@angular/core';
import { Statement } from 'src/app/models/statemet';
import { StatementService } from 'src/app/services/statement.service';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  schemaStatements: Statement[];
  patternStatements: Statement[];
  loading = false;
  // private rawStatements: Statement[];
  selectedStatement: Statement;

  constructor(private stmtService: StatementService) { }

  ngOnInit() {
    // this.statementService.statementsObservable.subscribe(statements => {
    //   this.rawStatements = statements;
    // });
    // this.statementService.getStatements();
    this.loading = true;
    this.stmtService.statementsObservable.subscribe(statements => {
      this.schemaStatements = statements.filter(statement => statement.eventType);
      this.patternStatements = statements.filter(statement => !statement.eventType);
      if (this.schemaStatements.length > 0 || this.patternStatements.length > 0) {
        this.loading = false;
      }
    });
    this.stmtService.getStatements();
  }

  statementSelected(statement: Statement) {
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
