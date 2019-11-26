import { StatementService } from './../../services/statement.service';
import { Statement } from './../../models/statemet';
import { Component, OnInit } from '@angular/core';

declare var Blockly: any;

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.css']
})
export class BlocklyComponent implements OnInit {
  statement: Statement;
  statementFunctionName = 'Create statement';
  messageHistory = [];
  public workspacePlayground: any;
  public toolbox = `
    <xml id="toolbox" style="display: none">
      <category name ="EVENT" colour="20">
        <label text="Create new type"></label>
        <block type="new_event_type"></block>
        <block type="new_event_attribute"></block>
        <label text="Existing types"></label>
      </category>
      <sep gap="8"></sep>
      <category name="CONDITION" colour="200">

      </category>
    </xml>`;

  constructor( private stmtService: StatementService ) { }

  ngOnInit() {
    this.initStatement();
    this.createBlocks();
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

  private createBlocks(): BlocklyComponent {
    const blocklyDiv = document.getElementById( 'blocklyDiv' );
    this.workspacePlayground = Blockly.inject(
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
    return this.workspacePlayground;
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
    statement.eplStatement = Blockly.EPL.workspaceToCode(this.workspacePlayground);
    statement.blocklyXml = Blockly.Xml.workspaceToDom(this.workspacePlayground).outerHTML.replace(/\\([\s\S])|(")/g, "\\$1$2");
    statement.eventType = this.statement.eplStatement.includes('create json schema');
    return statement;
  }
}
