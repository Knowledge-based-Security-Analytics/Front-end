import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatDividerModule } from '@angular/material/divider'
import { MatTabsModule } from '@angular/material/tabs'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'



@NgModule({
  declarations: [],
  exports: [
    MatToolbarModule,
    MatGridListModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
  ]
})
export class MaterialModule { }
