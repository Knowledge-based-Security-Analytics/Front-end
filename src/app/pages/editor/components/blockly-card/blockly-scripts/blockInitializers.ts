import { StatementService } from './../../../../../shared/services/statement.service';
import { IEventAlias } from '../../../../../shared/models/eplObjectRepresentation';
import { BlocklyService } from './../../../services/blockly.service';
import { Schema } from 'src/app/shared/models/eplObjectRepresentation';
import { THEME_VARIABLES, BLOCKS, PATTERN_STRUCTURE } from 'src/app/shared/models/strings';
declare var Blockly: any;

export class BlockInitializers {

  constructor(private blocklyService: BlocklyService) {}

  public initBlocks(): void {
    this.initEventTypeBlocks();
    this.initEventAliasBlocks();
    this.initPatternBlocks();
    this.initConditionBlocks();
    this.initActionBlocks();
  }
  private initEventTypeBlocks(): void {
    Blockly.Blocks.type = {
      init() {
        this.appendDummyInput()
            .appendField('Event Type:')
            .appendField(new Blockly.FieldDropdown([['atomic', 'SIMPLE_TYPE'], ['complex', 'COMPLEX_TYPE']]), 'EVENT_TYPE');
        this.appendStatementInput('ATTRIBUTES')
            .setCheck('attribute_definition');
        this.setColour(20);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.attribute_definition = {
      init() {
        this.appendDummyInput()
            .appendField('Attribute:')
            .appendField(new Blockly.FieldTextInput('name'), 'ATTRIBUTE_NAME')
            .appendField(', Type: ')
            .appendField(new Blockly.FieldDropdown([
              ['Integer', 'int'],
              ['Float', 'double'],
              ['Text', 'string'],
              ['Boolean', 'boolean']]), 'ATTRIBUTE_TYPE');
        this.setPreviousStatement(true, 'attribute_definition');
        this.setNextStatement(true, 'attribute_definition');
        this.setColour(	THEME_VARIABLES.primary );
        this.setTooltip('');
      }
    };
  }
  private initEventAliasBlocks(): void {
    Blockly.Blocks.event_alias = {
      init() {
        this.appendDummyInput()
          .appendField(new Blockly.FieldLabelSerializable(''), 'ALIAS')
          .appendField('->')
          .appendField(new Blockly.FieldDropdown([['att1', 'att1']]), 'ATTRIBUTE');
        this.setOutput(true, null);
        this.setColour( THEME_VARIABLES.primary );
        this.setTooltip('');
      }
    };
  }
  private initPatternBlocks(): void {
    const env: any = this;
    Blockly.Blocks.event = {
      init() {
        const dropDownData = env.blocklyService.eventTypes.map((type: any) => [type, type]);
        this.appendDummyInput()
          .appendField('Event')
          .appendField(new Blockly.FieldDropdown(dropDownData), 'EVENT_TYPE')
          .appendField('as')
          .appendField(new Blockly.FieldVariable(''), 'EVENT_ALIAS');
        this.appendStatementInput('CONDITION')
          .setCheck('condition');
        this.setInputsInline(false);
        this.setPreviousStatement(true, 'event');
        this.setNextStatement(true, 'event');
        this.setColour( THEME_VARIABLES.info );
        this.setTooltip('');
      },
      onchange(event: any) {
        if (event.type === Blockly.Events.CHANGE) {
          if (event.name === 'EVENT_TYPE') {
            const eventAlias = env.blocklyService.workspace.getBlockById(event.blockId).getFieldValue('EVENT_ALIAS');
            Blockly.Variables.getVariable(env.blocklyService.workspace, eventAlias).type = event.newValue;
          } else if (event.name === 'EVENT_ALIAS') {
            const eventType = env.blocklyService.workspace.getBlockById(event.blockId).getFieldValue('EVENT_TYPE');
            Blockly.Variables.getVariable(env.blocklyService.workspace, event.newValue).type = eventType;
            Blockly.Variables.getVariable(env.blocklyService.workspace, event.oldValue).type = '';
          }
        }
      }
    };

/*     Blockly.Blocks.event_pattern = {
      init() {
        this.appendDummyInput()
          .appendField('Tansform');
        this.appendStatementInput('EVENT_PATTERN')
          .setCheck( ['event', 'event_pattern_structure'] );
        this.appendDummyInput()
          .appendField('to new event');
        this.appendValueInput('EVENT_SCHEMA')
          .setCheck('EVENT_TYPE');
        this.appendStatementInput('ACTIONS')
          .setCheck('test');
        this.setInputsInline(true);
        this.setColour(200);
        this.setTooltip('');
      }
    }; */

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
        this.setColour( THEME_VARIABLES.info );
        this.setTooltip('');
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
        this.setColour( THEME_VARIABLES.info );
        this.setTooltip('');
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
        this.setColour( THEME_VARIABLES.info );
        this.setTooltip('');
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
        this.setColour( THEME_VARIABLES.info );
        this.setTooltip('');
      }
    };
  }
  private initConditionBlocks(): void {
    Blockly.Blocks.condition_or = {
      init() {
        this.appendStatementInput('CONDITION_1')
          .setCheck(['value_condition', 'logical_condition']);
        this.appendDummyInput()
          .appendField('OR');
        this.appendStatementInput('CONDITION_2')
          .setCheck(['value_condition', 'logical_condition']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, ['condition', 'logical_condition']);
        this.setColour( THEME_VARIABLES.success );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition_and = {
      init() {
        this.appendStatementInput('CONDITION_1')
          .setCheck(['value_condition', 'logical_condition']);
        this.appendDummyInput()
          .appendField('AND');
        this.appendStatementInput('CONDITION_2')
          .setCheck(['value_condition', 'logical_condition']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, ['condition', 'logical_condition']);
        this.setColour( THEME_VARIABLES.success );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition = {
      init() {
        this.appendDummyInput();
        this.appendValueInput('LEFT')
            .setCheck(['condition_text_input', 'condition_number_input']);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
              ['=', '='], ['>', '>'], ['<', '<'], ['!=', '!='], ['<=', '<='], ['>=', '>=']
            ]), 'LOGICAL_OPERATOR');
        this.appendValueInput('RIGHT')
            .setCheck(['condition_text_input', 'condition_number_input']);
        this.setPreviousStatement(true, ['value_condition', 'condition']);
        this.setNextStatement(false);
        this.setColour( THEME_VARIABLES.success );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition_text_input = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('text'), 'TEXT_INPUT');
        this.setOutput(true, 'condition_text_input');
        this.setColour( THEME_VARIABLES.success );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition_number_input = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), 'NUMBER_INPUT');
        this.setOutput(true, 'condition_number_input');
        this.setColour( THEME_VARIABLES.success );
        this.setTooltip('');
      }
    };
  }

  private initActionBlocks(): void {
    const env: any = this;
    Blockly.Blocks.action = {
      init() {
        this.appendDummyInput()
          .appendField('to event schema');
        this.appendValueInput('EVENT_SCHEMA')
          .setCheck('EVENT_TYPE');
        this.appendStatementInput('ACTIONS')
          .setCheck('test');
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'action');
        this.setColour( THEME_VARIABLES.warning );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.existing_schema = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable(''), 'EVENT_TYPE');
        this.setOutput(true, 'EVENT_TYPE');
        this.setColour( THEME_VARIABLES.warning );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.new_schema = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('newSchema'), 'EVENT_TYPE');
        this.setOutput(true, 'EVENT_TYPE');
        this.setColour( THEME_VARIABLES.warning );
        this.setTooltip('');
      }
    };
  }
}
