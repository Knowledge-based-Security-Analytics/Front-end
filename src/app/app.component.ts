import { MENU_ITEMS } from './app.pages-menu';
import { Component } from '@angular/core';
import { Statement } from './models/statemet';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menu = MENU_ITEMS;
  public debugStatement: Statement;
  debugging = false;

  constructor(private sidebarService: NbSidebarService) { }

  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  public debug(statement: Statement) {
    this.debugStatement = statement;
    this.debugging = true;
  }
}
