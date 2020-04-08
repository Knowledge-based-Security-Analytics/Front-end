import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

import { Pattern, Schema } from 'src/app/models/statement';
import { StatementService } from 'src/app/shared/services/statement.service';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {
  @Input() schemaStatements: Schema[];
  @Input() patternStatements: Pattern[];
  @Output() statementSelected: EventEmitter<Pattern | Schema> = new EventEmitter<Pattern | Schema>();

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
    this.statementSelected.emit(statements.find(statement => statement.deploymentProperties.id === deploymentId));
  }
}
