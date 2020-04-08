import { ThemeModule } from './@theme/theme.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PagesModule } from './pages/pages.module';
import {
  NbLayoutModule,
  NbButtonModule,
  NbMenuModule,
  NbIconModule,
  NbToastrModule,
  NbActionsModule,
  NbTooltipModule,
  NbDialogModule,
  NbContextMenuModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { GraphQLModule } from './shared/graphql/graphql.module';
import { StatementService } from './shared/services/statement.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    PagesModule,
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    ThemeModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    NbIconModule,
    NbActionsModule,
    NbTooltipModule,
    NbButtonModule,
    NbContextMenuModule,
  ],
  providers: [
    StatementService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
