import { BlocklyComponent } from './components/blockly/blockly.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const editorRoutes: Routes = [
  {path: 'rule-editor', component: BlocklyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(editorRoutes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
