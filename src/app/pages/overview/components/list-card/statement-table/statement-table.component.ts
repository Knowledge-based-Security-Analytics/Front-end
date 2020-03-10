import { Component, Input, OnChanges, TemplateRef, EventEmitter, Output } from '@angular/core';
import { Statement } from '@angular/compiler';
import {
  NbTreeGridDataSource,
  NbSortDirection,
   NbTreeGridDataSourceBuilder,
   NbDialogService,
   NbSortRequest } from '@nebular/theme';

@Component({
  selector: 'app-statement-table',
  templateUrl: './statement-table.component.html',
  styleUrls: ['./statement-table.component.scss']
})
export class StatementTableComponent implements OnChanges {
  @Input() statements: Statement[];
  @Output() dropStatement: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectStatement: EventEmitter<string> = new EventEmitter<string>();

  statementsTreeNodes: TreeNode<Statement>[];
  dataSource: NbTreeGridDataSource<Statement>;

  deploymentModeColumn = 'deploymentMode';
  nameColumn = 'name';
  actionsColumn = 'deploymentId';
  allColumns = [this.deploymentModeColumn, this.nameColumn, this.actionsColumn];

  schemaDataSource: NbTreeGridDataSource<Statement>;
  patternDataSource: NbTreeGridDataSource<Statement>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<Statement>,
    private dialogService: NbDialogService) { }

  ngOnChanges() {
    this.statementsTreeNodes = this.statements.map(statement => Object.assign({data: statement}));
    this.dataSource = this.dataSourceBuilder.create(this.statementsTreeNodes);
  }

  onDropStatement( deploymentId: string, dialog: TemplateRef<any> ) {
    this.dialogService.open(dialog, {closeOnBackdropClick: false, autoFocus: false})
      .onClose.subscribe(dialogResult => {
        if (dialogResult) {
          this.dropStatement.emit(deploymentId);
        }
      });
  }

  onSelectStatement( deploymentId: string ) {
    this.selectStatement.emit(deploymentId);
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
