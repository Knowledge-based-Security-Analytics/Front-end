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
  private eventAliases: string[] = [];
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
      <category name="ALIASES" custom="ALIASES" colour="65"></category>
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
      const eventAlias = prompt('Please enter an event alias');
      if (eventAlias) {
        this.eventAliases.push(eventAlias);
        const test = new Blockly.VariableModel(this.workspace, eventAlias);
        new Blockly.Events.VarCreate(test).run(true);
      }
    });

    this.workspace.registerToolboxCategoryCallback('ALIASES', () => {
      const xmlList = [];
      xmlList.push(Blockly.Xml.textToDom('<button text="Add event alias" callbackKey="addEventAliasCallback"></button>'));
      if ( this.workspace.variableMap_.variableMap_[''] ) {
        this.workspace.variableMap_.variableMap_[''].map((variable: any) =>  {
          xmlList.push(Blockly.Xml.textToDom(`<block type="event_alias"><field name="ALIAS">${variable.name}</field></block>`));
        });
      }
      return xmlList;
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
