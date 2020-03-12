import { NbDialogService } from '@nebular/theme';
import { Component, Input, EventEmitter, Output, TemplateRef } from '@angular/core';

import { Statement } from 'src/app/models/statemet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() statement: Statement;
  @Output() statementChanged: EventEmitter<Statement> = new EventEmitter<Statement>();

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
   ) { }

  public onChangeDeploymentMode(production: boolean): void {
    production ? this.statement.deploymentMode = 'prod' : this.statement.deploymentMode = 'dev';
  }

  public onCreateStatement(): void {
    this.statementChanged.emit(this.statement);
  }

  public onCancelEdit( dialog: TemplateRef<any> ): void {
    this.dialogService.open(dialog, {closeOnBackdropClick: false, autoFocus: false})
      .onClose.subscribe(dialogResult => {
        if (dialogResult) {
          this.router.navigate(['/']);
        }
    });
  }
}
