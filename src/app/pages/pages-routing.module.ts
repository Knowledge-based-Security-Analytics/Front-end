import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import {OverviewComponent} from './overview/overview.component';


const routes: Routes = [
  {
    path: 'editor',
    component: EditorComponent,
  },
  {
    path: 'editor/:deploymentId',
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
