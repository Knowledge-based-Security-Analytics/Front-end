import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
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
