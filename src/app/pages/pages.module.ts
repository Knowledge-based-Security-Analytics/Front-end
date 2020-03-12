import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { EditorModule } from './editor/editor.module';
import { OverviewModule } from './overview/overview.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    EditorModule,
    OverviewModule
  ]
})
export class PagesModule { }
