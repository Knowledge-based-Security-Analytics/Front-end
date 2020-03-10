import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() statement: Statement;
  @Output() statementChanged: EventEmitter<Statement> = new EventEmitter<Statement>();

  constructor( ) { }

  public changeDeploymentMode(production: boolean): void {
    production ? this.statement.deploymentMode = 'prod' : this.statement.deploymentMode = 'dev';
  }

  public async createStatement(): Promise<void> {
    this.statementChanged.emit(this.statement);
  }
}
