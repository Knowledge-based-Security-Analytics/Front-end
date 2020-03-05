import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { OverviewComponent } from './components/overview/overview.component';


const routes: Routes = [{
  path: 'rules',
  component: OverviewComponent,
},
{
  path: 'rule/:id',
  component: DebuggerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyzerRoutingModule { }
