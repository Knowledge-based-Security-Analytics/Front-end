import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

import { StatementService } from 'src/app/services/statement.service';
import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {
  @Output() statementSelected: EventEmitter<Statement> = new EventEmitter<Statement>();

  get schemaStatements(): Statement[] {
    return this._schemaStatements;
  }
  set schemaStatements(schemaStatements: Statement[]) {
    this._schemaStatements = schemaStatements;
  }
  get patternStatements(): Statement[] {
    return this._patternStatements;
  }
  set patternStatements(patternStatements) {
    this._patternStatements = patternStatements;
  }

  // tslint:disable-next-line: variable-name
  private _schemaStatements: Statement[];
  // tslint:disable-next-line: variable-name
  private _patternStatements: Statement[];

  constructor(
    private stmtService: StatementService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.stmtService.statementsObservable.subscribe(statements => {
      this.schemaStatements = statements.filter(statement => statement.eventType);
      this.patternStatements = statements.filter(statement => !statement.eventType);
    });
    this.stmtService.getStatements();
  }

  onDropStatement(deploymentId: string) {
    this.stmtService.dropStatement(deploymentId).then(() => {
      this.toastrService.show(
        `Deployment ID: ${deploymentId}`,
        'Sucessfully dropped statement',
        { status: 'success' }
      );
    })
    .catch(() => {
      this.toastrService.show(
        `Deployment ID: ${deploymentId}`,
        'Failed dropping statement',
        { status: 'danger' }
      );
    });
  }

  onSelectStatement( deploymentId: string ) {
    const statements = [...this.patternStatements, ...this.schemaStatements];
    this.statementSelected.emit(statements.find(statement => statement.deploymentId === deploymentId));
  }
}
