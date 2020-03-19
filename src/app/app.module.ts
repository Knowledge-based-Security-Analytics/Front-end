import { ThemeModule } from './@theme/theme.module';
import { StatementService } from './services/statement.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphQLModule } from './services/graphql/graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PagesModule } from './pages/pages.module';
import {
  NbThemeModule,
  NbLayoutModule,
  NbButtonModule,
  NbMenuModule,
  NbIconModule,
  NbToastrModule,
  NbActionsModule,
  NbTooltipModule,
  NbDialogModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

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
  ],
  providers: [
    StatementService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
