import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [],
  exports: [
    MatToolbarModule,
    MatGridListModule,
    MatDividerModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
