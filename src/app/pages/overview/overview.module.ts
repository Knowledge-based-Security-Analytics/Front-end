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
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { OverviewRoutingModule } from './overview-routing.module';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { OverviewComponent } from './overview.component';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import {DetailCardComponent} from './components/detail-card/detail-card.component';
import {ListCardComponent} from './components/list-card/list-card.component';
import { StatementTableComponent } from './components/list-card/statement-table/statement-table.component';

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
  NgxEchartsModule,
];

@NgModule({
  declarations: [
    DebuggerComponent,
    OverviewComponent,
    DetailCardComponent,
    ListCardComponent,
    StatementTableComponent
  ],
  imports: [
    ...NB_MODULES,
    CommonModule,
    OverviewRoutingModule,
    ThemeModule,
    FormsModule,
    HighlightModule,
  ]
})
export class OverviewModule { }
