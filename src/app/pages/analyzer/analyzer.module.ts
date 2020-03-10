
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbTabsetModule,
  NbCardModule,
  NbListModule,
  NbActionsModule,
  NbTreeGridModule,
  NbInputModule,
  NbTooltipModule,
  NbIconModule,
  NbButtonModule
} from '@nebular/theme';

import { AnalyzerRoutingModule } from './analyzer-routing.module';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { SortFilterDialogComponent } from './components/overview/sort-filter-dialog/sort-filter-dialog.component';
import { StatementComponent } from './components/overview/statement/statement.component';
import { OverviewComponent } from './components/overview/overview.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { ListCardComponent } from './components/overview/list-card/list-card.component';

const NB_MODULES = [
  NbTabsetModule,
  NbCardModule,
  NbListModule,
  NbActionsModule,
  NbTreeGridModule,
  NbInputModule,
  NbTooltipModule,
  NbIconModule,
  NbButtonModule,
];

@NgModule({
  declarations: [DebuggerComponent, SortFilterDialogComponent, StatementComponent, OverviewComponent, ListCardComponent],
  imports: [
    ...NB_MODULES,
    CommonModule,
    AnalyzerRoutingModule,
    MaterialModule,
    FormsModule,
    HighlightModule,
  ]
})
export class AnalyzerModule { }
