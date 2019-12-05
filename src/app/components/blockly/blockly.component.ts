import { BlocklyParser } from './scripts/blocklyParser';
import { StatementService } from './../../services/statement.service';
import { Statement } from './../../models/statemet';
import { Component, OnInit } from '@angular/core';
import { BlocklyBlocks } from './scripts/blocklyBlocks';

declare var Blockly: any;

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.css']
})
export class BlocklyComponent implements OnInit {
  public statement: Statement;
  private blocklyParser: BlocklyParser;
  private blocklyBlocks: BlocklyBlocks;
  public workspace: any;
  public toolbox = `
    <xml id="toolbox" style="display: none">
      <category name ="EVENT TYPES" colour="20">
        <label text="Create new type"></label>
        <block type="type"></block>
        <sep gap="8"></sep>
        <block type="attribute_definition"></block>
        <label text="Existing types"></label>
      </category>
      <sep></sep>
      <category name="EVENT" colour="200">
        <block type="event"></block>
        <sep gap="32"></sep>
        <block type="event_pattern"></block>
        <sep gap="32"></sep>
        <block type="event_pattern_and"></block>
        <sep gap="8"></sep>
        <block type="event_pattern_or"></block>
        <sep gap="8"></sep>
        <block type="event_pattern_not"></block>
        <sep gap="8"></sep>
        <block type="event_pattern_repeat"></block>
      </category>
      <category name="CONDITION" colour="100">
        <block type="condition"></block>
      </category>
      <category name="ACTION" colour="300">
        <block type="action"></block>
      </category>
      <sep></sep>
      <category name="ALIASES" colour="300">
        <button text="Add event alias" callbackKey="addEventAliasCallback"></button>
      </category>
    </xml>`;

  constructor( private stmtService: StatementService ) {
    this.blocklyParser = new BlocklyParser(this.stmtService);
    this.blocklyBlocks = new BlocklyBlocks(this.stmtService);
  }

  ngOnInit() {
    this.initStatement();
    this.blocklyBlocks.initBlocks();
    this.blocklyParser.initParsers();
    this.initBlockly();
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

  private initBlockly(): BlocklyComponent {
    const blocklyDiv = document.getElementById( 'blocklyDiv' );
    this.workspace = Blockly.inject(
      blocklyDiv,
      {
        toolbox: this.toolbox,
        grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
        trashcan: true,
        scrollbars: false,
        zoom: {
          controls: true,
          wheel: false,
        }
      });
    this.workspace.addChangeListener(() => {
      document.getElementById( 'blocklyOutput' ).innerHTML = Blockly.EPL.workspaceToCode(this.workspace);
    });

    this.workspace.registerButtonCallback('addEventAliasCallback', () => {
      console.log('TEST');
    });

    return this.workspace;
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
    statement.eplStatement = Blockly.EPL.workspaceToCode(this.workspace);
    statement.blocklyXml = Blockly.Xml.workspaceToDom(this.workspace).outerHTML.replace(/\\([\s\S])|(")/g, "\\$1$2");
    statement.eventType = this.statement.eplStatement.includes('create json schema');
    return statement;
  }
}
