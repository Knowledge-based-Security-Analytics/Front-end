import { SortFilterDialogComponent, FilterOptions, SortOptions } from './sort-filter-dialog/sort-filter-dialog.component';
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
  public statements: OverwiewStatement[];

  public filter: FilterOptions = {};
  public sort: SortOptions = {};

  constructor(private statementService: StatementService, private dialog: MatDialog) { }

  ngOnInit() {
    this.statementService.statementsObservable.subscribe(statements => {
      console.log(statements);
      this.statements = statements.map(statement => Object.assign({}, statement));
      this.filterStatements();
      this.sortStatements();
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
      statement.visible = true;

      if (this.filter.deploymentMode) {
        if (statement.deploymentMode !== this.filter.deploymentMode) {
          statement.visible = false;
        }
      }
    });
  }

  public sortStatements() {
    if (this.sort.byName) {
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
    });
    dialogRef.afterClosed().subscribe(result => {
      this.sort = result.sort;
      this.filter = result.filter;
      this.sortStatements();
      this.filterStatements();
    });
  }
}

interface OverwiewStatement extends Statement {
  visible?: boolean;
}
