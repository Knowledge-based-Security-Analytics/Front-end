import { BlocklyService } from './services/blockly.service';
import { StatementService } from './../../services/statement.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Statement } from 'src/app/models/statemet';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  get statement(): Statement {
    return this._statement;
  }
  set statement(statement: Statement) {
    this._statement = statement;
  }
  // tslint:disable-next-line: variable-name
  private _statement: Statement;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stmtService: StatementService,
    private blocklyService: BlocklyService,
    private toastrService: NbToastrService
  ) {
    this.initStatement();
  }

  public async saveStatement(statement: Statement): Promise<void> {
    this.statement = statement;
    this.addEplAndBlocklyXml();
    this.statement.deploymentId = this.statement.deploymentId ? await this.deployUpdatedStatement() : await this.deployNewStatement();
    this.blocklyService.clearBlocklyWorkspace();
    this.showToast();
    this.router.navigate(['/']);
  }

  private initStatement() {
    const deploymentId = this.route.snapshot.paramMap.get('deploymentId');
    if (deploymentId) {
      this.statement = this.stmtService.getStatement(deploymentId);
      this.blocklyService.setBlocklyXml(this.statement.blocklyXml);
    } else {
      this.initEmptyStatement();
    }
  }

  private initEmptyStatement(): void {
    this.statement = {
      deploymentId: '',
      deploymentDependencies: [],
      deploymentMode: 'dev',
      eplStatement: '',
      name: '',
      blocklyXml: '',
      eventType: false
    };
  }

  private addEplAndBlocklyXml(): void {
    this.statement.eplStatement = this.blocklyService.getEplStatement();
    this.statement.blocklyXml = this.blocklyService.getBlocklyXml();
    this.statement.eventType = this.statement.eplStatement.includes('create json schema');
  }

  private deployUpdatedStatement(): Promise<string> {
    return this.stmtService.updateStatement(
      this.statement.deploymentId,
      this.statement.name,
      this.statement.deploymentMode,
      this.statement.eventType,
      this.statement.eplStatement,
      this.statement.blocklyXml
    );
  }

  private deployNewStatement(): Promise<string> {
    return this.stmtService.pushStatement(
      this.statement.eplStatement,
      this.statement.blocklyXml,
      this.statement.name,
      this.statement.deploymentMode,
      this.statement.eventType);
  }

  private showToast() {
    this.toastrService.show(
      `Deployment ID: ${this.statement.deploymentId}`,
      `Successfully deployed "${this.statement.name}"`,
      { status: 'success' }
    );
  }
}
