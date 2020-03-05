import { EPLParsed } from 'src/app/models/statemet';
import { BlocklyParser } from './scripts/blocklyParser';
import { StatementService } from '../../../../services/statement.service';
import { Statement } from '../../../../models/statemet';
import { Component, OnInit } from '@angular/core';
import { BlocklyBlocks } from './scripts/blocklyBlocks';

declare var Blockly: any;

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss']
})
export class BlocklyComponent implements OnInit {
  public statement: Statement;

  private blocklyParser: BlocklyParser;
  private blocklyBlocks: BlocklyBlocks;

  constructor( private stmtService: StatementService ) {
    this.blocklyParser = new BlocklyParser();
    this.blocklyBlocks = new BlocklyBlocks(this.stmtService);
  }

  ngOnInit() {
    this.initStatement();
    this.blocklyBlocks.initBlockly();
    this.blocklyParser.initParsers();
  }

  private initStatement(): void {
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

  public async createStatement(): Promise<void> {
    this.statement = this.updateStatement(this.statement);
    this.statement.deploymentId = await this.stmtService.pushStatement(
      this.statement.eplStatement,
      this.statement.blocklyXml,
      this.statement.name,
      this.statement.deploymentMode,
      this.statement.eventType);
    Blockly.getMainWorkspace().clear();
    alert('Successfully deployed statement with deploymentId ' + this.statement.deploymentId);
  }

  private updateStatement(statement: Statement): Statement {
    statement.eplStatement = Blockly.EPL.workspaceToCode(this.blocklyBlocks.workspace);
    statement.blocklyXml = Blockly.Xml.workspaceToDom(this.blocklyBlocks.workspace).outerHTML.replace(/\\([\s\S])|(")/g, '\\$1$2');
    statement.eventType = this.statement.eplStatement.includes('create json schema');
    return statement;
  }
}
