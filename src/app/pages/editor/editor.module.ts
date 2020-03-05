import { MaterialModule } from './../../shared/material/material.module';
import { BlocklyComponent } from './components/blockly/blockly.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BlocklyComponent
  ],
  imports: [
    CommonModule,
    EditorRoutingModule,
    MaterialModule,
    FormsModule,
  ]
})
export class EditorModule { }
