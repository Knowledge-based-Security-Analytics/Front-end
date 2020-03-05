import { StatementService } from './services/statement.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './shared/graphql/graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { SortFilterDialogComponent } from './pages/analyzer/components/overview/sort-filter-dialog/sort-filter-dialog.component';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    GraphQLModule,
    HttpClientModule,
    PagesModule
  ],
  entryComponents: [
    SortFilterDialogComponent
  ],
  providers: [
    StatementService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
