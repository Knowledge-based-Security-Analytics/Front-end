import { StatementService } from './../../../services/statement.service';
import { EPLParsed } from 'src/app/models/statemet';

declare var Blockly: any;

export class BlocklyBlocks {
  private stmtService: StatementService;
  private statements: EPLParsed[];
  private eventTypes: string[] = [];

  constructor(stmtService: StatementService) {
    this.stmtService = stmtService;
    this.stmtService.statementsObservable.subscribe( newStatements => {
      this.statements = newStatements.filter(statement => statement.eventType).map(statement => statement.eplParsed);
      this.statements.map(statement => this.eventTypes.push(statement.name));
    });
  }

  public initBlocks(): void {
    this.initEventTypeBlocks();
    this.initPatternBlocks();
    this.initConditionBlocks();
    this.initActionBlocks();
    this.initVariableBlocks();
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
        this.setColour(40);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_alias = {
      init() {
        this.appendDummyInput()
          .appendField(new Blockly.FieldLabelSerializable(''), 'ALIAS');
        this.setOutput(true, null);
        this.setColour(65);
        this.setTooltip('');
      }
    };
  }

  private initPatternBlocks(): void {
    const env: any = this;
    Blockly.Blocks.event = {
      init() {
        const dropDownData = env.eventTypes.map((type: any) => [type, type]);
        this.appendDummyInput()
          .appendField('Event')
          .appendField(new Blockly.FieldDropdown(dropDownData), 'EVENT_TYPE')
          .appendField('as')
          .appendField(new Blockly.FieldVariable('eventAlias'), 'EVENT_ALIAS');
        this.appendValueInput('CONDITION')
          .setCheck('condition')
          .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, 'event');
        this.setNextStatement(true, 'event');
        this.setColour(230);
        this.setTooltip('');
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
      }
    };
  }

  private initActionBlocks(): void {
    const env: any = this;
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
      }
    };
  }

  private initVariableBlocks(): void {
    const env: any = this;
  }
}
