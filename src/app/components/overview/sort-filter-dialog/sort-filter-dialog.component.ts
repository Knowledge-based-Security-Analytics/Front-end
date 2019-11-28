import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sort-filter-dialog',
  templateUrl: './sort-filter-dialog.component.html',
  styleUrls: ['./sort-filter-dialog.component.css']
})
export class SortFilterDialogComponent implements OnInit {
  public filter: FilterOptions = {};
  public sort: SortOptions = {};

  public sortSelected: string;

  constructor(public dialogRef: MatDialogRef<SortFilterDialogComponent>) { }

  ngOnInit() {
  }

  onOkClicked() {
    if (this.sortSelected) {
      this.sort[this.sortSelected] = true;
    }
    this.dialogRef.close({filter: this.filter, sort: this.sort});
  }
}

export interface SortOptions {
  byName?: boolean;
}

export interface FilterOptions {
  deploymentMode?: string;
}
