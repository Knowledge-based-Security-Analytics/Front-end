import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

import { BlocklyService } from './services/blockly.service';
import { Pattern, Schema } from 'src/app/models/statement';
import { StatementService } from 'src/app/shared/services/statement.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public loading = false;
  public saving = false;
  private deploymentId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stmtService: StatementService,
    public blocklyService: BlocklyService,
    private toastrService: NbToastrService
  ) {
    this.route.paramMap.subscribe( paramMap => {
      this.blocklyService.statementType = paramMap.get('statementType');
      this.deploymentId = paramMap.get('deploymentId');
    });
  }

  ngOnInit() {
    this.initStatement();
  }

  public async saveStatement(statement: Pattern | Schema): Promise<void> {
    this.blocklyService.statement = statement;
    this.addEplAndBlocklyXml();
    this.saving = true;
    this.blocklyService.statement.deploymentProperties.id = await this.deployStatement();
    this.blocklyService.clearBlocklyWorkspace();
    this.saving = false;
    this.router.navigate(['/']);
    this.showToast();
  }

  private async initStatement() {
    this.loading = true;
    if (this.deploymentId) {
      this.blocklyService.statement = this.stmtService.getStatement(this.deploymentId);
      await this.blocklyService.setBlocklyXml(this.blocklyService.statement.blocklyXml);
    } else {
      this.initEmptyStatement();
    }
    this.loading = false;
  }

  private initEmptyStatement(): void {
    this.blocklyService.statement = this.blocklyService.statementType === 'schema' ? new Schema() : new Pattern();
  }

  private deployStatement(): Promise<string> {
    return this.blocklyService.statement.deploymentProperties.id ? this.deployUpdatedStatement() : this.deployNewStatement();
  }

  private addEplAndBlocklyXml(): void {
    // this.statement.eplStatement = this.blocklyService.getEplStatement();
    this.blocklyService.statement.blocklyXml = this.blocklyService.getBlocklyXml();
    // this.statement.eventType = this.statement.eplStatement.includes('create json schema');
  }

  private deployUpdatedStatement(): Promise<string> {
    return this.stmtService.updateStatement(this.blocklyService.statement);

  }

  private deployNewStatement(): Promise<string> {
    return this.stmtService.pushStatement(this.blocklyService.statement);
  }

  private showToast() {
    this.toastrService.show(
      `Deployment ID: ${this.blocklyService.statement.deploymentProperties.id}`,
      `Successfully deployed "${this.blocklyService.statement.name}"`,
      { status: 'success' }
    );
  }
}
