import { CoreModule } from './../../@core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NbInputModule,
  NbButtonModule,
  NbLayoutModule,
  NbCardModule,
  NbActionsModule,
  NbIconModule,
  NbToggleModule,
  NbSpinnerModule,
  NbFormFieldModule,
} from '@nebular/theme';

import { EditorComponent } from './editor.component';
import { BlocklyCardComponent } from './components/blockly-card/blockly-card.component';
import { InfoCardComponent } from './components/info-card/info-card.component';

const NB_MODULES = [
  NbInputModule,
  NbButtonModule,
  NbLayoutModule,
  NbCardModule,
  NbActionsModule,
  NbIconModule,
  NbToggleModule,
  NbSpinnerModule,
  NbFormFieldModule
];
@NgModule({
  declarations: [
    BlocklyCardComponent,
    EditorComponent,
    InfoCardComponent,
  ],
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    ...NB_MODULES,
  ]
})
export class EditorModule { }
