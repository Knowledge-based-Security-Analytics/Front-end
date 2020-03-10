import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  NbTreeGridDataSource,
  NbSortDirection,
  NbTreeGridDataSourceBuilder,
  NbSortRequest,
  NbDialogRef,
  NbDialogService,
  NbToastrService} from '@nebular/theme';

import { StatementService } from 'src/app/services/statement.service';
import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {

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
  private schemaStatementsTreeNodes: TreeNode<Statement>[];
  // tslint:disable-next-line: variable-name
  private _patternStatements: Statement[];
  private patternStatementsTreeNodes: TreeNode<Statement>[];

  deploymentModeColumn = 'deploymentMode';
  nameColumn = 'name';
  actionsColumn = 'deploymentId';
  allColumns = [this.deploymentModeColumn, this.nameColumn, this.actionsColumn];

  schemaDataSource: NbTreeGridDataSource<Statement>;
  patternDataSource: NbTreeGridDataSource<Statement>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private stmtService: StatementService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<Statement>,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit() {
    this.stmtService.statementsObservable.subscribe(statements => {
      this.schemaStatements = statements.filter(statement => statement.eventType);
      this.schemaStatementsTreeNodes = this.schemaStatements.map(statement => Object.assign({data: statement}));
      this.schemaDataSource = this.dataSourceBuilder.create(this.schemaStatementsTreeNodes);
      this.patternStatements = statements.filter(statement => !statement.eventType);
      this.patternStatementsTreeNodes = this.patternStatements.map(statement => Object.assign({data: statement}));
      this.patternDataSource = this.dataSourceBuilder.create(this.patternStatementsTreeNodes);
    });
    this.stmtService.getStatements();
  }

  dropStatement(deploymentId: string, dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {closeOnBackdropClick: false, autoFocus: false})
      .onClose.subscribe(dialogResult => {
        if (dialogResult) {
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
      });
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
