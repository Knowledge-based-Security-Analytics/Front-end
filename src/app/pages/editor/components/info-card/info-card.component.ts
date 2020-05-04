import { NbDialogService } from '@nebular/theme';
import { Component, Input, EventEmitter, Output, TemplateRef } from '@angular/core';

import { Pattern, Schema } from 'src/app/shared/models/eplObjectRepresentation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() statement: Pattern | Schema;
  @Output() statementChanged: EventEmitter<Pattern | Schema> = new EventEmitter<Pattern | Schema>();

  constructor(
    private dialogService: NbDialogService,
    private router: Router,
   ) { }

  public onChangeDeploymentMode(production: boolean): void {
    production ? this.statement.deploymentProperties.mode = 'prod' : this.statement.deploymentProperties.mode = 'dev';
  }

  public onChangeStatementName(newStatementName: string) {
    this.statement.name = newStatementName.replace(/\s/gi, '_');
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
