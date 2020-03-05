
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyzerRoutingModule } from './analyzer-routing.module';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { SortFilterDialogComponent } from './components/overview/sort-filter-dialog/sort-filter-dialog.component';
import { StatementComponent } from './components/overview/statement/statement.component';
import { OverviewComponent } from './components/overview/overview.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';


@NgModule({
  declarations: [DebuggerComponent, SortFilterDialogComponent, StatementComponent, OverviewComponent],
  imports: [
    CommonModule,
    AnalyzerRoutingModule,
    MaterialModule,
    FormsModule,
    HighlightModule,
  ]
})
export class AnalyzerModule { }
