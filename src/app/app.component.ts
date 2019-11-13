import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'visual-cep-frontend';

  debugging = false;

  toggleChanged(debugging: boolean): void {
    this.debugging = debugging;
  }
}
