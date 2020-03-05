import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlocklyComponent } from './editor/components/blockly/blockly.component';
import { OverviewComponent } from './analyzer/components/overview/overview.component';


const routes: Routes = [
  {
    path: 'editor',
    component: BlocklyComponent,
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
