import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { EditorModule } from './editor/editor.module';
import { AnalyzerModule } from './analyzer/analyzer.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    EditorModule,
    AnalyzerModule
  ]
})
export class PagesModule { }
