import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbDialogModule, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';

const NB_MODULES = [
  NbDialogModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
];

@NgModule({
  declarations: [

  ],
  imports: [
    ...NB_MODULES,
    CommonModule
  ]
})
export class CoreModule { }
