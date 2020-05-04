import { StatementService } from 'src/app/shared/services/statement.service';
import { SINGLE_SEQUENCE_PATTERN } from './../../../../../shared/models/strings';
import { ValueCondition, LogicalCondition, Statement, Schema } from '../../../../../shared/models/eplObjectRepresentation';
import { BlocklyService } from './../../../services/blockly.service';
import {
  RepeatPattern,
  NotPattern,
  ConditionedEvent,
  IEventAlias,
  OrPattern,
  AndPattern } from 'src/app/shared/models/eplObjectRepresentation';
import { DOUBLE_SEQUENCE_PATTERN, BLOCKS } from 'src/app/shared/models/strings';

declare var Blockly: any;

export class BlockParsers {

  constructor(
    private blocklyService: BlocklyService,
    private stmtService: StatementService) { }

  public initParsers(): void {
    this.initEventTypeParser();
    this.initEventAliasParser();
    this.initPatternParser();
    this.initConditionParser();
    this.initActionParser();
  }

  private castPatternType( event: any ): ConditionedEvent | RepeatPattern | NotPattern | OrPattern | AndPattern {
    if (event.hasOwnProperty('patternType')) {
      switch (event.patternType) {
        case 'REPEAT':
          return event as RepeatPattern;
        case 'NOT':
          return event as NotPattern;
        case 'OR':
          return event as OrPattern;
        case 'AND':
          return event as AndPattern;
      }
    } else {
      return event as ConditionedEvent;
    }
  }

  private parseDoubleSequencePattern( pattern: OrPattern | AndPattern, block: any ): string {
    for (const event of JSON.parse( `[${Blockly.EPL.statementToCode(block, DOUBLE_SEQUENCE_PATTERN.expression1)}]`) ) {
      pattern.eventSequenceA.push(this.castPatternType(event));
    }
    for (const event of JSON.parse( `[${Blockly.EPL.statementToCode(block, DOUBLE_SEQUENCE_PATTERN.expression2)}]`) ) {
      pattern.eventSequenceB.push(this.castPatternType(event));
    }

    if (!block.getSurroundParent()) {
      if (!Statement.isSchema(this.blocklyService.statement)) {
        this.blocklyService.statement.eventSequence.push(pattern);
      }
    }

    return block.nextConnection.targetConnection ? JSON.stringify(pattern) + ', ' : JSON.stringify(pattern);
  }

  private parseSingleSequencePattern( pattern: RepeatPattern | NotPattern, block: any ): string {
    for ( const event of JSON.parse(`[${Blockly.EPL.statementToCode(block, SINGLE_SEQUENCE_PATTERN.expression1)}]`) ) {
      pattern.eventSequence.push(this.castPatternType(event));
    }

    if (!block.getSurroundParent()) {
      if (!Statement.isSchema(this.blocklyService.statement)) {
        this.blocklyService.statement.eventSequence.push(pattern);
      }
    }

    return block.nextConnection.targetConnection ? JSON.stringify(pattern) + ', ' : JSON.stringify(pattern);
  }

  private initEventTypeParser(): void {
    Blockly.EPL.attribute_definition = (block: any): string => {
      const attribute = {
        name: block.getFieldValue(BLOCKS.attribute.fields.name),
        type: block.getFieldValue(BLOCKS.attribute.fields.type)
      };
      if (Statement.isSchema(this.blocklyService.statement)) {
       this.blocklyService.statement.attributes.push(attribute);
      }
      return block.nextConnection.targetConnection ? JSON.stringify(attribute) + ', ' : JSON.stringify(attribute);
    };

    Blockly.EPL.existing_schema = (block: any): string => {
      return `${block.getFieldValue(BLOCKS.outputSchema.fields.schema)}`;
    };

    Blockly.EPL.new_schema = (block: any): string => {
      return `${block.getFieldValue(BLOCKS.outputSchema.fields.schema)}`;
    };
  }

  private initEventAliasParser(): void {
    Blockly.EPL.event_alias = (block: any): string => {
      return block.getFieldValue(BLOCKS.eventAlias.fields.alias) + '.' + block.getFieldValue(BLOCKS.eventAlias.fields.attribute);
    };
  }

  private initPatternParser(): void {
    Blockly.EPL.event = (block: any): string => {
      const eventAlias = block.workspace.variableMap_.variableMap_[''].find((variableModel: any) => {
        return variableModel.id_ === block.getFieldValue(BLOCKS.sequencePattern.fields.alias);
      }).name;

      const conditionedEvent = new ConditionedEvent();
      conditionedEvent.event = {alias: eventAlias, eventType: block.getFieldValue(BLOCKS.sequencePattern.fields.type)};
      if (!Statement.isSchema(this.blocklyService.statement)) {
        if (!this.blocklyService.statement.events.find( event => event.alias === conditionedEvent.event.alias)) {
          this.blocklyService.statement.events.push(conditionedEvent.event);
        }

        for (const condition of JSON.parse(`[${Blockly.EPL.statementToCode(block, BLOCKS.sequencePattern.statements.condition)}]`)) {
          conditionedEvent.condition = condition;
        }

        if (!block.getSurroundParent()) {
          this.blocklyService.statement.eventSequence.push(conditionedEvent);
        }
      }
      return block.nextConnection.targetConnection ? JSON.stringify(conditionedEvent) + ', ' : JSON.stringify(conditionedEvent);
    };

    Blockly.EPL.event_pattern_repeat = (block: any): string => {
      const repeatPattern = new RepeatPattern();
      repeatPattern.times = block.getFieldValue(BLOCKS.repeatPattern.fields.repeatCount);
      return this.parseSingleSequencePattern(repeatPattern, block);
    };

    Blockly.EPL.event_pattern_not = (block: any): string => {
      const notPattern = new NotPattern();
      return this.parseSingleSequencePattern(notPattern, block);
    };

    Blockly.EPL.event_pattern_or = (block: any): string => {
      const orPattern = new OrPattern();
      return this.parseDoubleSequencePattern(orPattern, block);
    };

    Blockly.EPL.event_pattern_and = (block: any): string => {
      const andPattern = new AndPattern();
      return this.parseDoubleSequencePattern(andPattern, block);
    };
  }

  private initConditionParser(): void {
    Blockly.EPL.condition_or = (block: any): string => {
      const logicalCondition = new LogicalCondition();
      logicalCondition.operator = 'or';
      const value1 = Blockly.EPL.statementToCode(block, BLOCKS.orCondition.statements.expression1);
      const value2 = Blockly.EPL.statementToCode(block, BLOCKS.orCondition.statements.expression2);
      if (value1 !== '') {
        logicalCondition.value1 = JSON.parse(value1);
      }
      if (value2 !== '') {
        logicalCondition.value2 = JSON.parse(value2);
      }
      return JSON.stringify(logicalCondition);
    };

    Blockly.EPL.condition_and = (block: any): string => {
      const logicalCondition = new LogicalCondition();
      logicalCondition.operator = 'and';
      const value1 = Blockly.EPL.statementToCode(block, BLOCKS.andCondition.statements.expression1);
      const value2 = Blockly.EPL.statementToCode(block, BLOCKS.andCondition.statements.expression2);
      if (value1 !== '') {
        logicalCondition.value1 = JSON.parse(value1);
      }
      if (value2 !== '') {
        logicalCondition.value2 = JSON.parse(value2);
      }
      return JSON.stringify(logicalCondition);
    };

    Blockly.EPL.condition = (block: any): string => {
      const valueCondition = new ValueCondition();
      valueCondition.value1 = Blockly.EPL.statementToCode(block, BLOCKS.condition.fields.leftInput).trim();
      valueCondition.operator = block.getFieldValue(BLOCKS.condition.fields.operator);
      valueCondition.value2 = Blockly.EPL.statementToCode(block, BLOCKS.condition.fields.rightInput).trim();
      return JSON.stringify(valueCondition);
    };

    Blockly.EPL.condition_text_input = (block: any): string => {
      return block.getFieldValue(BLOCKS.conditionTextInput.fields.textInput).trim();
    };

    Blockly.EPL.condition_number_input = (block: any): string => {
      return JSON.stringify(block.getFieldValue(BLOCKS.conditionNumberInput.fields.numberInput)).trim();
    };
  }

  private initActionParser(): void {
    Blockly.EPL.action = (block: any): string => {
      if (!Statement.isSchema(this.blocklyService.statement)) {
        const schemaName = Blockly.EPL.statementToCode(block, BLOCKS.action.fields.outputSchema).trim();
        const outputSchema = this.stmtService.getSchema(schemaName);
        this.blocklyService.statement.outputSchema = outputSchema ? outputSchema : new Schema(schemaName);
      }
      return `(${Blockly.EPL.statementToCode(block, BLOCKS.action.statements.outputVariables)})`;
    };

    Blockly.EPL.output_attribute = (block: any): string => {
      if (!Statement.isSchema(this.blocklyService.statement)) {
        this.blocklyService.statement.outputAttributes.push({
          inputAttribute: block.getFieldValue('input'),
          outputAttribute: block.getFieldValue('output')
        })
      }
      return '';
    };
  }
}
