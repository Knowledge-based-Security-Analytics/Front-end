import { StatementService } from './services/statement.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlocklyComponent } from './components/blockly/blockly.component';
import { DebuggerComponent } from './components/debugger/debugger.component';
import { OverviewComponent } from './components/overview/overview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { GraphQLModule } from './shared/graphql/graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material/material.module';
import { FormsModule } from '@angular/forms';
import { StatementComponent } from './components/overview/statement/statement.component';
import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  declarations: [
    AppComponent,
    BlocklyComponent,
    DebuggerComponent,
    OverviewComponent,
    ToolbarComponent,
    StatementComponent
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
    HighlightModule
  ],
  providers: [
    StatementService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
