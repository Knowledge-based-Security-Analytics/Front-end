import { SortFilterDialogComponent, FilterOptions} from './sort-filter-dialog/sort-filter-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Statement } from 'src/app/models/statemet';
import { StatementService } from 'src/app/services/statement.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private rawStatements: Statement[];
  public statements: OverwiewStatement[];

  public filter: FilterOptions = {};
  public sort: string;

  constructor(private statementService: StatementService, private dialog: MatDialog) { }

  ngOnInit() {
    this.statementService.statementsObservable.subscribe(statements => {
      console.log(statements);
      this.rawStatements = statements;
      this.resetLocalStatements();
    });
    this.statementService.getStatements();

    setInterval(() => {
      const i = Math.floor(Math.random() * Math.floor(this.statements.length));
      if (this.statements.length === 0) {
        return;
      }
      if (!this.statements[i].alertCount) {
        this.statements[i].alertCount = 0;
      }
      const c = Math.floor(Math.random() * Math.floor(100));
      this.statements[i].alertCount += c;
    }, 1000);
  }

  public dropStatement(i: number) {
    this.statementService.dropStatement(this.statements[i].deploymentId);
  }

  public filterStatements() {
    this.statements.forEach(statement => {
      statement.visible = false;

      if (this.filter.dev && statement.deploymentMode === 'dev') {
        statement.visible = true;
      }
      if (this.filter.prod && statement.deploymentMode === 'prod') {
        statement.visible = true;
      }
    });
  }

  public sortStatements() {
    if (this.sort === 'byName') {
      this.statements.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
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
          filter: this.filter
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
}

interface OverwiewStatement extends Statement {
  visible?: boolean;
}
