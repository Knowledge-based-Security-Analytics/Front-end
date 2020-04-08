import { ValueCondition, LogicalCondition, Statement } from '../../../../../models/statement';
import { BlocklyService } from './../../../services/blockly.service';
import { RepeatPattern, NotPattern, ConditionedEvent, IEventAlias, OrPattern, AndPattern } from 'src/app/models/statement';

declare var Blockly: any;

export class BlockParsers {

  constructor(private blocklyService: BlocklyService) { }

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
    for (const event of JSON.parse( `[${Blockly.EPL.statementToCode(block, 'EVENTS_1')}]`) ) {
      pattern.eventSequenceA.push(this.castPatternType(event));
    }
    for (const event of JSON.parse( `[${Blockly.EPL.statementToCode(block, 'EVENTS_2')}]`) ) {
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
    for ( const event of JSON.parse(`[${Blockly.EPL.statementToCode(block, 'EVENTS')}]`) ) {
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
    Blockly.EPL.type = (block: any): string => {
      const basicAttributes = [
        {name: 'complex', type: 'boolean'},
        {name: 'id', type: 'string'},
        {name: 'timestamp', type: 'string'}
      ];
      const complexAttributes = [
        ...basicAttributes,
        {name: 'sources', type: 'object[]'}
      ];

      if (Statement.isSchema(this.blocklyService.statement)) {
        if (block.getFieldValue('EVENT_TYPE') === 'COMPLEX_TYPE') {
          this.blocklyService.statement.attributes.push(...complexAttributes);
        } else {
          this.blocklyService.statement.attributes.push(...basicAttributes);
        }
      }

      Blockly.EPL.statementToCode(block, 'ATTRIBUTES');

      return JSON.stringify(this.blocklyService.statement);
    };

    Blockly.EPL.attribute_definition = (block: any): string => {
      const attribute = {name: block.getFieldValue('ATTRIBUTE_NAME'), type: block.getFieldValue('ATTRIBUTE_TYPE')};
      if (Statement.isSchema(this.blocklyService.statement)) {
        if (block.getFieldValue('EVENT_TYPE') === 'COMPLEX_TYPE') {
          this.blocklyService.statement.attributes.push(attribute);
        }
      }
      return block.nextConnection.targetConnection ? JSON.stringify(attribute) + ', ' : JSON.stringify(attribute);
    };

    Blockly.EPL.existing_schema = (block: any): string => {
      return `${block.getFieldValue('EVENT_TYPE')}`;
    };

    Blockly.EPL.new_schema = (block: any): string => {
      return `${block.getFieldValue('EVENT_TYPE')}`;
    };
  }

  private initEventAliasParser(): void {
    Blockly.EPL.event_alias = (block: any): string => {
      return `${block.getFieldValue('ALIAS')}.${block.getFieldValue('ATTRIBUTE')}`;
    };
  }

  private initPatternParser(): void {
    Blockly.EPL.event_pattern = (block: any): string => {
      Blockly.EPL.statementToCode(block, 'EVENT_PATTERN');
      return JSON.stringify(this.blocklyService.statement);
    };

    Blockly.EPL.event = (block: any): string => {
      const eventAlias = block.workspace.variableMap_.variableMap_[''].find((variableModel: any) => {
        return variableModel.id_ === block.getFieldValue('EVENT_ALIAS');
      }).name;

      const newEvent: IEventAlias = {alias: eventAlias, eventType: block.getFieldValue('EVENT_TYPE')};
      if (!Statement.isSchema(this.blocklyService.statement)) {
        if (!this.blocklyService.statement.events.find( event => event.alias === newEvent.alias)) {
          this.blocklyService.statement.events.push(newEvent);
        }

        if (!block.getSurroundParent()) {
          const conditionedEvent = new ConditionedEvent();

          conditionedEvent.event = newEvent;
          for (const condition of JSON.parse(`[${Blockly.EPL.statementToCode(block, 'CONDITION')}]`)) {
            conditionedEvent.condition = condition;
          }

          this.blocklyService.statement.eventSequence.push(conditionedEvent);
        }
      }
      return block.nextConnection.targetConnection ? JSON.stringify(newEvent) + ', ' : JSON.stringify(newEvent);
    };

    Blockly.EPL.event_pattern_repeat = (block: any): string => {
      const repeatPattern = new RepeatPattern();
      repeatPattern.times = block.getFieldValue('COUNT');
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
      for (const condition of JSON.parse(`[${Blockly.EPL.statementToCode(block, 'CONDITION_1')}]`) ) {
        logicalCondition.value1.push(condition);
      }
      for (const condition of JSON.parse(`[${Blockly.EPL.statementToCode(block, 'CONDITION_2')}]`) ) {
        logicalCondition.value2.push(condition);
      }
      return JSON.stringify(logicalCondition);
    };

    Blockly.EPL.condition_and = (block: any): string => {
      const logicalCondition = new LogicalCondition();
      logicalCondition.operator = 'and';
      for (const condition of JSON.parse(`[${Blockly.EPL.statementToCode(block, 'CONDITION_1')}]`) ) {
        logicalCondition.value1.push(condition);
      }
      for (const condition of JSON.parse(`[${Blockly.EPL.statementToCode(block, 'CONDITION_2')}]`) ) {
        logicalCondition.value2.push(condition);
      }
      return JSON.stringify(logicalCondition);
    };

    Blockly.EPL.condition = (block: any): string => {
      const valueCondition = new ValueCondition();
      valueCondition.value1 = Blockly.EPL.statementToCode(block, 'LEFT');
      valueCondition.operator = block.getFieldValue('LOGICAL_OPERATOR');
      valueCondition.value2 = Blockly.EPL.statementToCode(block, 'RIGHT');
      return JSON.stringify(valueCondition);
    };

    Blockly.EPL.condition_text_input = (block: any): string => {
      return `${block.getFieldValue('TEXT_INPUT')}`;
    };

    Blockly.EPL.condition_number_input = (block: any): string => {
      return `${block.getFieldValue('NUMBER_INPUT')}`;
    };
  }

  private initActionParser(): void {
    Blockly.EPL.action = (block: any): string => {
      return `(${Blockly.EPL.statementToCode(block, 'ACTIONS')})`;
    };
  }
}
