import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { OverviewComponent } from './overview.component';


const routes: Routes = [{
  path: 'rules',
  component: OverviewComponent,
},
{
  path: 'rule/:deploymentId',
  component: DebuggerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule { }
