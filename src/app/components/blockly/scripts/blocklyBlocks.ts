import { StatementService } from './../../../services/statement.service';

declare var Blockly: any;

export class BlocklyBlocks {
  private stmtService: StatementService;

  constructor(stmtService: StatementService) {
    this.stmtService = stmtService;
  }

  public initBlocks(): void {
    this.initEventTypeBlocks();
    this.initPatternBlocks();
    this.initConditionBlocks();
    this.initActionBlocks();
  }

  private initEventTypeBlocks(): void {
    Blockly.Blocks.type = {
      init() {
        this.appendDummyInput()
            .appendField('Event Type:')
            .appendField(new Blockly.FieldDropdown([['atomic', 'SIMPLE_TYPE'], ['complex', 'COMPLEX_TYPE']]), 'EVENT_TYPE')
            .appendField(new Blockly.FieldTextInput('type_name'), 'TYPE_NAME');
        this.appendStatementInput('ATTRIBUTES')
            .setCheck('attribute_definition');
        this.setColour(20);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.Blocks.attribute_definition = {
      init() {
        this.appendDummyInput()
            .appendField('Attribute:')
            .appendField(new Blockly.FieldTextInput('name'), 'ATTRIBUTE_NAME')
            .appendField(', Type: ')
            .appendField(new Blockly.FieldDropdown([
              ['numeric (int)', 'int'],
              ['numeric (float)', 'double'],
              ['textual', 'string'],
              ['binary', 'boolean']]), 'ATTRIBUTE_TYPE');
        this.setPreviousStatement(true, 'attribute_definition');
        this.setNextStatement(true, 'attribute_definition');
        this.setColour(40);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };
  }

  private initPatternBlocks(): void {
    Blockly.Blocks.event = {
      init() {
        this.appendDummyInput()
          .appendField('Event')
          .appendField(new Blockly.FieldDropdown([['option', 'OPTIONNAME'], ['option', 'OPTIONNAME']]), 'EVENT_TYPE')
          .appendField('as')
          .appendField(new Blockly.FieldTextInput('default'), 'EVENT_ALIAS');
        this.appendValueInput('CONDITION')
          .setCheck('condition')
          .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, 'event');
        this.setNextStatement(true, 'event');
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.Blocks.event_pattern = {
      init() {
        this.appendDummyInput()
          .appendField('Event');
        this.appendStatementInput('EVENT_PATTERN')
          .setCheck( ['event', 'event_pattern_structure'] );
        this.setInputsInline(true);
        this.setNextStatement(true, 'action');
        this.setColour(200);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.Blocks.event_pattern_and = {
      init() {
        this.appendStatementInput('EVENTS_1')
          .setCheck(['event', 'event_pattern_structure']);
        this.appendDummyInput()
          .appendField('AND');
        this.appendStatementInput('EVENTS_2')
          .setCheck(['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'event_pattern_structure');
        this.setNextStatement(true, 'event_pattern_structure');
        this.setColour(220);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.Blocks.event_pattern_or = {
      init() {
        this.appendStatementInput('EVENTS_1')
          .setCheck(['event', 'event_pattern_structure']);
        this.appendDummyInput()
          .appendField('OR');
        this.appendStatementInput('EVENTS_2')
          .setCheck(['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'event_pattern_structure');
        this.setNextStatement(true, 'event_pattern_structure');
        this.setColour(220);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.Blocks.event_pattern_not = {
      init() {
        this.appendDummyInput()
          .appendField('NOT');
        this.appendStatementInput('EVENTS')
          .setCheck(['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, ['event', 'event_pattern_structure']);
        this.setNextStatement(true, ['event', 'event_pattern_structure']);
        this.setColour(220);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };

    Blockly.Blocks.event_pattern_repeat = {
      init() {
        this.appendDummyInput()
          .appendField('Find')
          .appendField(new Blockly.FieldNumber(1), 'COUNT')
          .appendField('time(s)');
        this.appendStatementInput('EVENTS')
          .setCheck( ['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, ['event', 'event_pattern_structure']);
        this.setNextStatement(true, ['event', 'event_pattern_structure']);
        this.setColour(220);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };
  }

  private initConditionBlocks(): void {
    Blockly.Blocks.condition = {
      init() {
        this.appendDummyInput()
          .appendField('Condition');
        this.appendStatementInput('CONDITIONS')
          .setCheck('condition');
        this.setOutput(true, 'condition');
        this.setColour(100);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };
  }

  private initActionBlocks(): void {
    Blockly.Blocks.action = {
      init() {
        this.appendDummyInput()
          .appendField('Action');
        this.appendStatementInput('ACTIONS')
          .setCheck('test');
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'action');
        this.setColour(300);
        this.setTooltip('');
        this.setHelpUrl('');
      }
    };
  }
}
