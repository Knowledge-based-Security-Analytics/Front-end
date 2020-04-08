import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import {OverviewComponent} from './overview/overview.component';


const routes: Routes = [
  {
    path: 'editor/:statementType',
    component: EditorComponent,
  },
  {
    path: 'editor/:statementType/:deploymentId',
    component: EditorComponent
  },
  {
    path: 'rules',
    component: OverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
