import { Injectable } from '@angular/core';
import { Pattern, Schema, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { StatementService } from 'src/app/shared/services/statement.service';
import { THEME_VARIABLES } from 'src/app/@theme/styles/variables';

declare var Blockly: any;

@Injectable({
  providedIn: 'root'
})
export class BlocklyService {

  public workspace: any;
  public toolboxSchema = `
  <xml id="toolbox" style="display: none">
    <category name ="SCHEMA" custom="SCHEMA" colour="${THEME_VARIABLES.primary[400]}"></category>
  </xml>`;
  public toolboxPattern = `
  <xml id="toolbox" style="display: none">
    <category name="EVENT" custom="EVENT" colour="${THEME_VARIABLES.info[400]}"></category>
    <category name="CONDITION" custom="CONDITION" colour="${THEME_VARIABLES.success[400]}"></category>
    <category name="ACTION" custom="ACTION" colour="${THEME_VARIABLES.warning[400]}"></category>
  </xml>`;
  public eventTypes: string[] = [];
  public eventAliases: string[] = [];
  public statementType = '';
  public statement: Pattern | Schema;

  constructor(private stmtService: StatementService) {
    this.stmtService.statementsObservable.subscribe( newStatements => {
      this.eventTypes = [];
      newStatements
        .filter(statement => Statement.isSchema(statement))
        .map(statement => this.eventTypes.push(statement.name));
    });
  }

  public initPreviewChangeListener(): void {
    const basicAttributes = [
      {name: 'complex', type: 'boolean'},
      {name: 'id', type: 'string'},
      {name: 'timestamp', type: 'string'}
    ];
    const complexAttributes = [
      ...basicAttributes,
      {name: 'sources', type: 'object[]'}
    ];

    this.workspace.addChangeListener(() => {
      if (Statement.isSchema(this.statement)) {
        this.statement.attributes = [];
        this.statement.attributes.push(...this.statement.complexEvent ? complexAttributes : basicAttributes);
      } else {
        this.statement.outputAttributes = [];
        this.statement.events = [];
        this.statement.eventSequence = [];
      }
      Blockly.EPL.workspaceToCode(this.workspace);
      console.log(this.statement);
      /* if (document.getElementById( 'blocklyOutput' )) {
        document.getElementById( 'blocklyOutput' ).innerHTML = Blockly.EPL.workspaceToCode(this.blocklyWorkspace);
      } */
    });
  }

  public getEplStatement(): string {
    return Blockly.EPL.workspaceToCode(this.workspace);
  }

  public getBlocklyXml(): string {
    return new XMLSerializer()
    .serializeToString(Blockly.Xml.workspaceToDom(this.workspace))
    .replace(/"/g, '\'');
  }

  public async setBlocklyXml(xml: string): Promise<string> {
    return new Promise((resolve) => {
      const blocklyXML = new DOMParser().parseFromString(xml, 'text/xml').documentElement;
      setTimeout(() => {
        Blockly.Xml.appendDomToWorkspace(blocklyXML, this.workspace);
        resolve('Loaded');
      }, 1500);
    });
  }

  public clearBlocklyWorkspace(): void {
    Blockly.getMainWorkspace().clear();
  }
}
