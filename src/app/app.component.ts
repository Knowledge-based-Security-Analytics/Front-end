import { MENU_ITEMS } from './app.pages-menu';
import { Component } from '@angular/core';
import { Statement } from './models/statemet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menu = MENU_ITEMS;
  public debugStatement: Statement;
  debugging = false;

  constructor() { }

  public debug(statement: Statement) {
    this.debugStatement = statement;
    this.debugging = true;
  }
}
