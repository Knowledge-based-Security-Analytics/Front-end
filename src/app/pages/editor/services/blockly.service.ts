import { Injectable } from '@angular/core';
import { Pattern, Schema, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { StatementService } from 'src/app/shared/services/statement.service';
import { THEME_VARIABLES } from 'src/app/@theme/styles/variables';
import { ObjectRepToEpl } from '../components/blockly-card/blockly-scripts/objectRepToEpl';

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
  public eventTypes: Schema[] = [];
  public eventAliases: string[] = [];
  public statementType = '';
  public statement: Pattern | Schema;

  constructor(private stmtService: StatementService) {
    this.stmtService.statementsObservable.subscribe( newStatements => {
      this.eventTypes = [];
      newStatements.map((statement: Schema | Pattern) => {
        if (Statement.isSchema(statement)) {
          this.eventTypes.push(statement);
        }
      });
    });
  }

  public initPreviewChangeListener(): void {
    this.workspace.addChangeListener(() => {
      let eplStatement = '';
      if (Statement.isSchema(this.statement)) {
        this.statement.attributes = [];
        this.statement.attributes.push(...this.statement.complexEvent ? Schema.COMPLEX_ATTRIBUTES : Schema.BASIC_ATTRIBUTES);
        Blockly.EPL.workspaceToCode(this.workspace);
        eplStatement = ObjectRepToEpl.translateSchemaToEpl(this.statement);
      } else {
        this.statement.outputAttributes = [];
        this.statement.events = [];
        this.statement.eventSequence = [];
        Blockly.EPL.workspaceToCode(this.workspace);
        eplStatement = ObjectRepToEpl.translatePatternToEpl(this.statement);
      }

      this.statement.deploymentProperties.eplStatement = eplStatement;
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
