import { IEventAlias, Statement } from '../../../../../shared/models/eplObjectRepresentation';
import { BlocklyService } from './../../../services/blockly.service';
import { StatementService } from 'src/app/shared/services/statement.service';
declare var Blockly: any;

export class ToolboxCallbacks {

  constructor(
    private blocklyService: BlocklyService,
    private stmtService: StatementService) { }

  public registerToolboxCategoryCallbacks(): void {
    this.registerEventSchemaCategory();
    this.registerPatternCategory();
    this.registerConditionCategory();
    this.registerActionCategory();
  }

  private registerEventSchemaCategory(): void {
    this.blocklyService.workspace.registerToolboxCategoryCallback('SCHEMA', () => {
      const xmlList = [];
      xmlList.push(Blockly.Xml.textToDom('<block type="attribute_definition"></block>'));
      return xmlList;
    });
  }

  private registerPatternCategory(): void {
    this.blocklyService.workspace.registerToolboxCategoryCallback('EVENT', () => {
      const xmlList = [];
      xmlList.push(Blockly.Xml.textToDom('<block type="event"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<sep gap="32"></sep>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="event_pattern_and"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<sep gap="8"></sep>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="event_pattern_or"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<sep gap="8"></sep>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="event_pattern_not"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<sep gap="8"></sep>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="event_pattern_repeat"></block>'));
      return xmlList;
    });
  }

  private registerConditionCategory(): void {
    this.blocklyService.workspace.registerToolboxCategoryCallback('CONDITION', () => {
      const xmlList = [];
      xmlList.push(Blockly.Xml.textToDom('<block type="condition_or"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="condition_and"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="condition"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="condition_text_input"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="condition_number_input"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<label text="Available Aliases"></label>'));
      if (!Statement.isSchema(this.blocklyService.statement)) {
        this.blocklyService.statement.events.map((a: IEventAlias) =>  {
          xmlList.push(Blockly.Xml.textToDom(`
            <block type="event_alias">
              <field name="ALIAS" >${a.alias}</field>
            </block>`
          ));
        });
      }
      return xmlList;
    });
  }

  private registerActionCategory(): void {
    this.blocklyService.workspace.registerToolboxCategoryCallback('ACTION', () => {
      const xmlList = [];
      xmlList.push(Blockly.Xml.textToDom('<block type="action"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<block type="output_attribute"></block>'));
      xmlList.push(Blockly.Xml.textToDom('<label text="Existing schemas"></label>'));
/*       xmlList.push(Blockly.Xml.textToDom('<block type="new_schema"></block>')); */
      this.blocklyService.eventTypes.map(( eventType: string ) => {
        xmlList.push(Blockly.Xml.textToDom(`<block type="existing_schema"><field name="SCHEMA">${eventType}</field></block>`));
      });
      return xmlList;
    });
  }
}
