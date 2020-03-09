import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbInputModule, NbButtonModule, NbLayoutModule, NbCardModule, NbActionsModule, NbIconModule, NbToggleModule } from '@nebular/theme';

import { BlocklyComponent } from './components/blockly/blockly.component';
import { EditorComponent } from './editor.component';
import { DetailsComponent } from './components/details/details.component';

const NB_MODULES = [
  NbInputModule,
  NbButtonModule,
  NbLayoutModule,
  NbCardModule,
  NbActionsModule,
  NbIconModule,
  NbToggleModule,
]
@NgModule({
  declarations: [
    BlocklyComponent,
    EditorComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ...NB_MODULES,
  ]
})
export class EditorModule { }
