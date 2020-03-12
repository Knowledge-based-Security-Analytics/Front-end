import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

import { BlocklyService } from './services/blockly.service';
import { StatementService } from './../../services/statement.service';
import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  get loading(): boolean {
    return this._loading;
  }
  set loading(loading: boolean) {
    this._loading = loading;
  }
  get statement(): Statement {
    return this._statement;
  }
  set statement(statement: Statement) {
    this._statement = statement;
  }
  // tslint:disable-next-line: variable-name
  private _statement: Statement;
  // tslint:disable-next-line: variable-name
  private _loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stmtService: StatementService,
    private blocklyService: BlocklyService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit() {
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

  private async initStatement() {
    this.loading = true;
    const deploymentId = this.route.snapshot.paramMap.get('deploymentId');
    if (deploymentId) {
      this.statement = this.stmtService.getStatement(deploymentId);
      await this.blocklyService.setBlocklyXml(this.statement.blocklyXml);
    } else {
      this.initEmptyStatement();
    }
    this.loading = false;
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
