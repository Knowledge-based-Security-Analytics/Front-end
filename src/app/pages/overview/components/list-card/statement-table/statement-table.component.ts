import { Component, Input, OnChanges, TemplateRef, EventEmitter, Output, ViewChild, ContentChild } from '@angular/core';
import {
  NbTreeGridDataSource,
  NbSortDirection,
   NbTreeGridDataSourceBuilder,
   NbDialogService,
   NbSortRequest } from '@nebular/theme';
import { Pattern, Schema } from 'src/app/shared/models/eplObjectRepresentation';
import { StatementService } from 'src/app/shared/services/statement.service';

@Component({
  selector: 'app-statement-table',
  templateUrl: './statement-table.component.html',
  styleUrls: ['./statement-table.component.scss']
})
export class StatementTableComponent implements OnChanges {
  @Input() statements: (Pattern | Schema)[];
  @Input() schemas: boolean;
  @Output() dropStatement: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectStatement: EventEmitter<string> = new EventEmitter<string>();

  statementsTreeNodes: TreeNode<Pattern | Schema>[];
  dataSource: NbTreeGridDataSource<Pattern | Schema>;

  deploymentModeColumn = 'mode';
  modifiedColumn = 'modified_locale';
  nameColumn = 'name';
  actionsColumn = 'id';
  allColumns = [this.deploymentModeColumn, this.nameColumn, this.modifiedColumn, this.actionsColumn];

  schemaDataSource: NbTreeGridDataSource<Pattern | Schema>;
  patternDataSource: NbTreeGridDataSource<Pattern | Schema>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<Pattern | Schema>,
    private dialogService: NbDialogService,
    private statementService: StatementService) { }

  ngOnChanges() {
    this.statementsTreeNodes = this.statements.map(statement => Object.assign({data: statement}));
    this.statements.map((statement: Pattern | Schema) => {
      // tslint:disable-next-line: no-string-literal
      statement['modified_locale'] = new Date(statement.lastModified).toLocaleString();
      // tslint:disable-next-line: no-string-literal
      statement['mode'] = statement.deploymentProperties.mode;
      // tslint:disable-next-line: no-string-literal
      statement['id'] = statement.deploymentProperties.id;
    });
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

  isEditable(deploymentId: string): boolean {
    return !this.statementService.isDependency(deploymentId);
  }
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}
