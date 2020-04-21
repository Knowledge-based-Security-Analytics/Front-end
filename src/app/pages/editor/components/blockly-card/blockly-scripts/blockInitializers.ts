import { StatementService } from './../../../../../shared/services/statement.service';
import { IEventAlias } from '../../../../../shared/models/eplObjectRepresentation';
import { BlocklyService } from './../../../services/blockly.service';
import { Schema } from 'src/app/shared/models/eplObjectRepresentation';
import { BLOCKS, PATTERN_STRUCTURE } from 'src/app/shared/models/strings';
import { THEME_VARIABLES } from 'src/app/@theme/styles/variables';

declare var Blockly: any;

export class BlockInitializers {

  constructor(
    private blocklyService: BlocklyService,
    private stmtService: StatementService ) {}

  public initBlocks(): void {
    this.initEventTypeBlocks();
    this.initEventAliasBlocks();
    this.initPatternBlocks();
    this.initConditionBlocks();
    this.initActionBlocks();
  }

  private initEventTypeBlocks(): void {
    Blockly.Blocks.attribute_definition = {
      init() {
        this.appendDummyInput()
        .appendField('A attribute named ')
            .appendField(new Blockly.FieldTextInput('name'), BLOCKS.attribute.fields.name)
            .appendField(' of type ')
            .appendField(new Blockly.FieldDropdown([
              ['Integer', 'int'],
              ['Float', 'double'],
              ['Text', 'string'],
              ['Boolean', 'boolean']]), BLOCKS.attribute.fields.type);
        this.setPreviousStatement(true, BLOCKS.attribute.name);
        this.setNextStatement(true, BLOCKS.attribute.name);
        this.setColour(	THEME_VARIABLES.primary[400] );
        this.setTooltip('A block describing an attribute of a event schema.');
      }
    };
  }

  private initEventAliasBlocks(): void {
    const env: any = this;
    Blockly.Blocks.event_alias = {
      init() {
        this.appendDummyInput()
          .appendField(new Blockly.FieldLabelSerializable(''), BLOCKS.eventAlias.fields.alias)
          .appendField('.')
          .appendField(new Blockly.FieldDropdown(() => {
            const alias = this.getFieldValue( BLOCKS.eventAlias.fields.alias) ?
              this.getFieldValue( BLOCKS.eventAlias.fields.alias) : null;
            if (alias) {
              const eventType = env.blocklyService.statement.events.find((event: IEventAlias) => event.alias === alias).eventType;
              const schema: Schema = env.stmtService.getSchema(eventType);
              const attributes = [];
              schema.attributes.map( attribute => {
                if (attribute.name !== 'complex') {
                  attributes.push([attribute.name, attribute.name]);
                }
              });
              return attributes;
            }
            return [['No attributes available', 'null']];
          }),  BLOCKS.eventAlias.fields.attribute);
        this.setOutput(true, BLOCKS.eventAlias.name);
        this.setColour( THEME_VARIABLES.success[600] );
        this.setTooltip('');
      }
    };
  }

  private initPatternBlocks(): void {
    const env: any = this;
    Blockly.Blocks.event = {
      init() {
        const dropDownData = env.blocklyService.eventTypes.map((type: any) => [type, type]);
        if (dropDownData.length === 0) {
          dropDownData.push(['No schemas available', 'null']);
        }
        this.appendDummyInput()
          .appendField('Event')
          .appendField(new Blockly.FieldDropdown(dropDownData), BLOCKS.sequencePattern.fields.type)
          .appendField('as')
          .appendField(new Blockly.FieldVariable(''), BLOCKS.sequencePattern.fields.alias);
        this.appendStatementInput(BLOCKS.sequencePattern.statements.condition)
          .setCheck(BLOCKS.sequencePattern.statements.conditionCheck);
        this.setInputsInline(false);
        this.setPreviousStatement(true, PATTERN_STRUCTURE);
        this.setNextStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setColour( THEME_VARIABLES.info[500] );
        this.setTooltip('');
      },
      onchange(event: any) {
        if (event.type === Blockly.Events.CHANGE) {
          if (event.name === BLOCKS.sequencePattern.fields.type) {
            const eventAlias = env.blocklyService.workspace.getBlockById(event.blockId)
              .getFieldValue(BLOCKS.sequencePattern.fields.alias);
            Blockly.Variables.getVariable(env.blocklyService.workspace, eventAlias).type = event.newValue;
          } else if (event.name === BLOCKS.sequencePattern.fields.alias) {
            const eventType = env.blocklyService.workspace.getBlockById(event.blockId)
              .getFieldValue(BLOCKS.sequencePattern.fields.type);
            Blockly.Variables.getVariable(env.blocklyService.workspace, event.newValue).type = eventType;
            Blockly.Variables.getVariable(env.blocklyService.workspace, event.oldValue).type = '';
          }
        }
      }
    };

    Blockly.Blocks.event_pattern_and = {
      init() {
        this.appendStatementInput(BLOCKS.andPattern.statements.expression1)
          .setCheck( PATTERN_STRUCTURE );
        this.appendDummyInput().appendField('AND');
        this.appendStatementInput(BLOCKS.andPattern.statements.expression2)
          .setCheck( PATTERN_STRUCTURE );
        this.setInputsInline(true);
        this.setPreviousStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setNextStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setColour( THEME_VARIABLES.info[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern_or = {
      init() {
        this.appendStatementInput(BLOCKS.orPattern.statements.expression1)
          .setCheck( PATTERN_STRUCTURE );
        this.appendDummyInput()
          .appendField('OR');
        this.appendStatementInput(BLOCKS.orPattern.statements.expression2)
          .setCheck( PATTERN_STRUCTURE );
        this.setInputsInline(true);
        this.setPreviousStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setNextStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setColour( THEME_VARIABLES.info[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern_not = {
      init() {
        this.appendDummyInput()
          .appendField('NOT');
        this.appendStatementInput(BLOCKS.notPattern.statements.expression1)
          .setCheck( PATTERN_STRUCTURE );
        this.setInputsInline(true);
        this.setPreviousStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setNextStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setColour( THEME_VARIABLES.info[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern_repeat = {
      init() {
        this.appendDummyInput()
          .appendField('Find')
          .appendField(new Blockly.FieldNumber(1), BLOCKS.repeatPattern.fields.repeatCount)
          .appendField('time(s)');
        this.appendStatementInput(BLOCKS.repeatPattern.statements.expression1)
          .setCheck( PATTERN_STRUCTURE );
        this.setInputsInline(true);
        this.setPreviousStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setNextStatement(true, [...PATTERN_STRUCTURE, BLOCKS.action.name]);
        this.setColour( THEME_VARIABLES.info[500] );
        this.setTooltip('');
      }
    };
  }

  private initConditionBlocks(): void {
    Blockly.Blocks.condition_or = {
      init() {
        this.appendStatementInput(BLOCKS.orCondition.statements.expression1)
          .setCheck([BLOCKS.condition.name, BLOCKS.andCondition.name, BLOCKS.orCondition.name]);
        this.appendDummyInput()
          .appendField('OR');
        this.appendStatementInput(BLOCKS.orCondition.statements.expression1)
          .setCheck([BLOCKS.condition.name, BLOCKS.andCondition.name, BLOCKS.orCondition.name]);
        this.setInputsInline(true);
        this.setPreviousStatement(true, [
          BLOCKS.sequencePattern.statements.conditionCheck,
          BLOCKS.andCondition.name,
          BLOCKS.orCondition.name
        ]);
        this.setColour( THEME_VARIABLES.success[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition_and = {
      init() {
        this.appendStatementInput(BLOCKS.andCondition.statements.expression1)
          .setCheck([BLOCKS.condition.name, BLOCKS.andCondition.name, BLOCKS.orCondition.name]);
        this.appendDummyInput()
          .appendField('AND');
        this.appendStatementInput(BLOCKS.andCondition.statements.expression1)
          .setCheck([BLOCKS.condition.name, BLOCKS.andCondition.name, BLOCKS.orCondition.name]);
        this.setInputsInline(true);
        this.setPreviousStatement(true, [
          BLOCKS.sequencePattern.statements.conditionCheck,
          BLOCKS.andCondition.name,
          BLOCKS.orCondition.name
        ]);
        this.setColour( THEME_VARIABLES.success[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition = {
      init() {
        this.appendDummyInput();
        this.appendValueInput(BLOCKS.condition.fields.leftInput)
            .setCheck([
              BLOCKS.conditionTextInput.name,
              BLOCKS.conditionNumberInput.name,
              BLOCKS.eventAlias.name
            ]);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
              ['=', '='], ['>', '>'], ['<', '<'], ['!=', '!='], ['<=', '<='], ['>=', '>=']
            ]), BLOCKS.condition.fields.operator);
        this.appendValueInput(BLOCKS.condition.fields.rightInput)
            .setCheck([
              BLOCKS.conditionTextInput.name,
              BLOCKS.conditionNumberInput.name,
              BLOCKS.eventAlias.name
            ]);
        this.setPreviousStatement(true, [
          BLOCKS.condition.name,
          BLOCKS.sequencePattern.statements.conditionCheck
        ]);
        this.setNextStatement(false);
        this.setColour( THEME_VARIABLES.success[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition_text_input = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('text'), BLOCKS.conditionTextInput.fields.textInput);
        this.setOutput(true, BLOCKS.conditionTextInput.name);
        this.setColour( THEME_VARIABLES.success[600] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.condition_number_input = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), BLOCKS.conditionNumberInput.fields.numberInput);
        this.setOutput(true, BLOCKS.conditionNumberInput.name);
        this.setColour( THEME_VARIABLES.success[600] );
        this.setTooltip('');
      }
    };
  }

  private initActionBlocks(): void {
    const env: any = this;
    Blockly.Blocks.action = {
      init() {
        const dropDownData = env.blocklyService.eventTypes.map((type: any) => [type, type]);
        this.appendDummyInput()
          .appendField('to event schema');
        this.appendValueInput(BLOCKS.action.fields.outputSchema)
          .setCheck(BLOCKS.outputSchema.name);
        this.appendStatementInput(BLOCKS.action.statements.outputVariables)
          .setCheck('output_attribute');
        this.setInputsInline(true);
        this.setPreviousStatement(true, BLOCKS.action.name);
        this.setColour( THEME_VARIABLES.warning[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.output_attribute = {
      init() {
        const inputDropdownData = [];
        env.blocklyService.statement.events.map(( event: IEventAlias ) => {
          env.stmtService.getSchema(event.eventType).attributes.map( (attribute: any) => {
            if (attribute.name !== 'timestamp' && attribute.name !== 'complex') {
              inputDropdownData.push([event.alias + '.' + attribute.name, event.alias + '.' + attribute.name]);
            }
          });
        });
        if (inputDropdownData.length === 0 ) {
          inputDropdownData.push(['No attributes available', 'null']);
        }

        const outputDropdownData = [];
        if (env.blocklyService.statement.outputSchema) {
          env.blocklyService.statement.outputSchema.attributes.map( (attribute: any) => {
            if (attribute.name !== 'complex' && attribute.name !== 'id' && attribute.name !== 'timestamp') {
              outputDropdownData.push([attribute.name, attribute.name]);
            }
          });
        }
        if (outputDropdownData.length === 0) {
          outputDropdownData.push(['No attributes available', 'null'])
        }

        this.appendDummyInput()
          .appendField('attribute');
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(inputDropdownData), 'input');
        this.appendDummyInput()
          .appendField('as');
        this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown(outputDropdownData), 'output');
        this.setInputsInline(true);
        this.setPreviousStatement(true, [BLOCKS.action.name, 'output_attribute']);
        this.setNextStatement(true, [ 'output_attribute' ]);
        this.setColour( THEME_VARIABLES.warning[500] );
        this.setTooltip('');
      }
    };

    Blockly.Blocks.existing_schema = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldLabelSerializable(''), BLOCKS.outputSchema.fields.schema);
        this.setOutput(true, BLOCKS.outputSchema.name);
        this.setColour( THEME_VARIABLES.warning[600] );
        this.setTooltip('');
      }
    };

/*     Blockly.Blocks.new_schema = {
      init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput('newSchema'), BLOCKS.outputSchema.fields.schema);
        this.setOutput(true, BLOCKS.outputSchema.name);
        this.setColour( THEME_VARIABLES.warning[600] );
        this.setTooltip('');
      }
    }; */
  }
}
