import { SortFilterDialogComponent, FilterOptions} from './sort-filter-dialog/sort-filter-dialog.component';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Statement } from 'src/app/models/statemet';
import { StatementService } from 'src/app/services/statement.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  @Output() debug = new EventEmitter<Statement>();

  private rawStatements: Statement[];
  public statements: OverviewStatement[];

  public filter: FilterOptions = {
    prod: true,
    dev: true,
    pattern: true,
    schema: true
  };
  public sort: string;

  constructor(private statementService: StatementService, private dialog: MatDialog) { }

  ngOnInit() {
    this.statementService.statementsObservable.subscribe(statements => {
      console.log(statements);
      this.rawStatements = statements;
      this.resetLocalStatements();
    });
    this.statementService.getStatements();

    // setInterval(() => {
    //   const i = Math.floor(Math.random() * Math.floor(this.rawStatements.length));
    //   if (this.rawStatements.length === 0) {
    //     return;
    //   }
    //   if (!this.rawStatements[i].alertCount) {
    //     this.rawStatements[i].alertCount = 0;
    //     this.statements[i].alertCount = 0;
    //   }
    //   const c = Math.floor(Math.random() * Math.floor(100));
    //   this.rawStatements[i].alertCount += c;
    //   this.statements[i].alertCount += c;
    //   this.sortStatements();
    // }, 1000);
  }

  public dropStatement(i: number) {
    this.statementService.dropStatement(this.statements[i].deploymentId);
  }

  public filterStatements() {
    this.statements.forEach(statement => {
      statement.visible = true;

      if (!this.filter.dev && statement.deploymentMode === 'dev') {
        statement.visible = false;
      }
      if (!this.filter.prod && statement.deploymentMode === 'prod') {
        statement.visible = false;
      }
      if (!this.filter.pattern && statement.eplParsed.type === 'pattern') {
        statement.visible = false;
      }
      if (!this.filter.schema && statement.eplParsed.type === 'schema') {
        statement.visible = false;
      }
    });
  }

  public sortStatements() {
    if (this.sort === 'byName') {
      this.statements.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } else if (this.sort === 'byAlertCount') {
      this.statements.sort((a, b) => {
        if (!a.alertCount && !b.alertCount) {
          return 0;
        }
        if (!b.alertCount) {
          return -1;
        }
        if (!a.alertCount) {
          return 1;
        }
        return b.alertCount - a.alertCount;
      });
    }  else if (this.sort === 'byDeploymentId') {
      this.statements.sort((a, b) => {
        if (a.deploymentId < b.deploymentId) {
          return -1;
        }
        if (a.deploymentId > b.deploymentId) {
          return 1;
        }
        return 0;
      });
    } else if (this.sort === 'byDeploymentMode') {
      this.statements.sort((a, b) => {
        if (a.deploymentMode < b.deploymentMode) {
          return 1;
        }
        if (a.deploymentMode > b.deploymentMode) {
          return -1;
        }
        return 0;
      });
    }
  }

  public openSortFilterDialog() {
    const dialogRef = this.dialog.open(SortFilterDialogComponent, {
      data: {
        sort: this.sort,
        filter: Object.assign({}, this.filter)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.sort = result.sort;
      this.filter = result.filter;
      this.resetLocalStatements();
    });
  }

  private resetLocalStatements() {
    this.statements = this.rawStatements.map(statement => Object.assign({}, statement));
    this.filterStatements();
    this.sortStatements();
  }

  public onDebug(statement: Statement) {
    this.debug.emit(statement);
  }

  public onAlert(count: number, alertedStatement: Statement) {
    for (const statement of this.rawStatements) {
      if (statement.deploymentId === alertedStatement.deploymentId) {
        statement.alertCount = alertedStatement.alertCount;
      }
    }
    this.sortStatements();
  }
}

interface OverviewStatement extends Statement {
  visible?: boolean;
}
