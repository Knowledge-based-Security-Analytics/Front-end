import { Component } from '@angular/core';
import { Statement } from './models/statemet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'visual-cep-frontend';

  public debugStatement: Statement;

  debugging = false;

  toggleChanged(debugging: boolean): void {
    this.debugging = debugging;
  }

  public debug(statement: Statement) {
    this.debugStatement = statement;
    this.debugging = true;
  }
}
