import { ThemeModule } from './../../@theme/theme.module';

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
  NbButtonModule,
  NbSpinnerModule,
  NbFormFieldModule,
  NbLayoutModule,
  NbToggleModule,
} from '@nebular/theme';

import { OverviewRoutingModule } from './overview-routing.module';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { OverviewComponent } from './overview.component';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { DetailCardComponent } from './components/detail-card/detail-card.component';
import { ListCardComponent } from './components/list-card/list-card.component';
import { StatementTableComponent } from './components/list-card/statement-table/statement-table.component';
import { LiveChartComponent } from './components/detail-card/live-chart/live-chart.component';

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
  NbSpinnerModule,
  NbFormFieldModule,
  NbToggleModule,
];


@NgModule({
  declarations: [
    DebuggerComponent,
    OverviewComponent,
    DetailCardComponent,
    ListCardComponent,
    StatementTableComponent,
    LiveChartComponent
  ],
  imports: [
    ...NB_MODULES,
    CommonModule,
    OverviewRoutingModule,
    ThemeModule,
    FormsModule,
    HighlightModule,
    NbLayoutModule,
    NbListModule
  ]
})
export class OverviewModule { }
