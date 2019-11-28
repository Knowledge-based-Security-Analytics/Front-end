import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sort-filter-dialog',
  templateUrl: './sort-filter-dialog.component.html',
  styleUrls: ['./sort-filter-dialog.component.css']
})
export class SortFilterDialogComponent implements OnInit {
  public filter: FilterOptions = {};
  public sort: string;

  constructor(public dialogRef: MatDialogRef<SortFilterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.filter = data.filter;
    this.sort = data.sort;
  }

  ngOnInit() {
  }

  onOkClicked() {
    this.dialogRef.close({filter: this.filter, sort: this.sort});
  }
}

export interface FilterOptions {
  dev?: boolean;
  prod?: boolean;
}
