import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbInputModule, NbButtonModule, NbLayoutModule } from '@nebular/theme';

import { EditorRoutingModule } from './editor-routing.module';
import { BlocklyComponent } from './components/blockly/blockly.component';

@NgModule({
  declarations: [
    BlocklyComponent
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    FormsModule,
    NbInputModule,
    NbButtonModule,
    NbLayoutModule
  ]
})
export class EditorModule { }
