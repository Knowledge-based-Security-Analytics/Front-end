import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

import { StatementService } from 'src/app/services/statement.service';
import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {
  @Input() schemaStatements: Statement[];
  @Input() patternStatements: Statement[];
  @Output() statementSelected: EventEmitter<Statement> = new EventEmitter<Statement>();

  constructor(
    private stmtService: StatementService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() { }

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
