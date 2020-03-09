import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OverviewComponent } from './analyzer/components/overview/overview.component';
import { EditorComponent } from './editor/editor.component';


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
