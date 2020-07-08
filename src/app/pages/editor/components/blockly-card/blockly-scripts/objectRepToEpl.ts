import { ConditionedEvent,
  RepeatPattern,
  NotPattern,
  AndPattern,
  OrPattern,
  LogicalCondition,
  ValueCondition,
  Condition } from 'src/app/shared/models/eplObjectRepresentation';
import { Schema,
  Pattern,
  PatternDefinition } from 'src/app/shared/models/eplObjectRepresentation';

export class ObjectRepToEpl {
  public static translateSchemaToEpl( schema: Schema ): string {
    let attributeString = '';
    for ( const attribute of schema.attributes ) {
      if (attribute.name === 'sources') {
        console.log('complex');
      }
      attributeString += `${attribute.name} ${attribute.type}`;
      attributeString += ((schema.attributes.indexOf(attribute) + 1) < schema.attributes.length) ? `, ` : ``;
    }
    // tslint:disable-next-line: max-line-length
    return `@name('${schema.outputName}') @JsonSchema( dynamic=true ) create json schema ${schema.outputName} as (${attributeString});`;
  }

  public static translatePatternToEpl( pattern: Pattern ): string {
    // console.log(pattern.eventSequence);
    const kafkaOutput = pattern.outputSchema.outputName;
    let outputAttributesString = '';

    for (const event of pattern.events) {
      outputAttributesString += `${event.alias} as source_${event.alias}`;
      if ((pattern.events.indexOf(event) + 1) < pattern.events.length ) {
        outputAttributesString += ', ';
      }
    }

    outputAttributesString += ', ';

    for (const outputAttribute of pattern.outputAttributes) {
      outputAttributesString += `${outputAttribute.inputAttribute} as ${outputAttribute.outputAttribute}`;
      if ((pattern.outputAttributes.indexOf(outputAttribute) + 1) < pattern.outputAttributes.length) {
        outputAttributesString += ', ';
      }
    }

    // tslint:disable-next-line: max-line-length
    return `@name('${pattern.outputName}') @KafkaOutput('${kafkaOutput}') select ${outputAttributesString} from pattern [every (${this.translateEventSequence(pattern.eventSequence)})]`;
  }

  private static translateEventSequence(eventSequence: (ConditionedEvent | PatternDefinition)[]) {
    let patternString = '';
    for (const patternPart of eventSequence) {
      if ( patternPart.hasOwnProperty('event') ) {
        patternString += this.translateConditionedEvent(patternPart as ConditionedEvent);
      } else {
        patternString += this.translatePatternDefinition(patternPart as PatternDefinition);
      }
      if ((eventSequence.indexOf(patternPart) + 1) < eventSequence.length) {
        patternString += ' -> ';
      }
    }
    return patternString + '';
  }

  private static translatePatternDefinition( patternPart: PatternDefinition ): string {
    switch (patternPart.patternType) {
       case 'REPEAT':
          return `(${this.translateEventSequence((patternPart as RepeatPattern).eventSequence)})[${(patternPart as RepeatPattern).times}]`;
        case 'NOT':
          return `NOT(${this.translateEventSequence((patternPart as NotPattern).eventSequence)})`;
        case 'OR':
          // tslint:disable-next-line: max-line-length
          return `(${this.translateEventSequence((patternPart as OrPattern).eventSequenceA)} OR ${this.translateEventSequence((patternPart as OrPattern).eventSequenceB)})`;
        case 'AND':
          // tslint:disable-next-line: max-line-length
          return `(${this.translateEventSequence((patternPart as AndPattern).eventSequenceA)} AND ${this.translateEventSequence((patternPart as AndPattern).eventSequenceB)})`;
    }
  }

  private static translateConditionedEvent( conditionedEvent: ConditionedEvent): string {
    const condition = this.translateCondition(conditionedEvent.condition);
    const conditionString = `${condition ? '(' + condition + ')' : ''}`;
    return `${conditionedEvent.event.alias}=${conditionedEvent.event.eventType.outputName}${conditionString}`;
  }

  private static translateCondition( condition: Condition ): string {
    if (condition) {
      if ( condition.type === 'value' ) {
        return this.translateValueCondition( condition as ValueCondition );
      } else {
        return this.translateLogicalCondition( condition as LogicalCondition );
      }
    }
  }

  private static translateLogicalCondition( condition: LogicalCondition ): string {
    return `(${this.translateCondition(condition.value1)}) ${condition.operator} (${this.translateCondition(condition.value2)})`;
  }

  private static translateValueCondition( condition: ValueCondition ): string {
    return `${condition.value1} ${condition.operator} ${condition.value2}`;
  }
}
