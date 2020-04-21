export class Statement {
  type: 'schema' | 'pattern';
  name = '';
  description = '';
  lastModified = '';
  blocklyXml = '';
  alertCount = 0;
  deploymentProperties: DeploymentProperties = new DeploymentProperties();

  static isSchema(statement: Schema | Pattern): statement is Schema {
    return (statement as Schema).type === 'schema';
  }

  isProdDeployed(): boolean {
    return this.deploymentProperties.mode === 'prod';
  }
}

class DeploymentProperties {
  id = '';
  dependencies: string[] = [];
  mode: 'prod' | 'dev' = 'dev';
  eplStatement = '';
}

export class Schema extends Statement {
  static readonly BASIC_ATTRIBUTES = [
    {name: 'complex', type: 'boolean'},
    {name: 'id', type: 'string'},
    {name: 'timestamp', type: 'string'}
  ];
  static readonly COMPLEX_ATTRIBUTES = [
    ...Schema.BASIC_ATTRIBUTES,
    {name: 'sources', type: 'object[]'}
  ];

  type: 'schema' = 'schema';
  complexEvent = false;
  attributes: {name: string, type: string}[] = Schema.BASIC_ATTRIBUTES;

  constructor(name?: string) {
    super();
    this.name = name ? name : null;
  }

  getObject(): {[key: string]: string} {
    const returnObj = {};
    this.attributes.map( attribute => returnObj[attribute.name] = attribute.type);
    return returnObj;
  }
}

export class ConditionedEvent {
  event: IEventAlias;
  condition: Condition;
}

export class Pattern extends Statement {
  type: 'pattern' = 'pattern';
  outputSchema: Schema = new Schema();
  outputAttributes: {inputAttribute: string, outputAttribute: string}[] = [];
  events: IEventAlias[] = [];
  eventSequence: (ConditionedEvent | PatternDefinition)[] = [];
}

export interface IEventAlias {
  alias: string;
  eventType: string;
}

abstract class PatternDefinition {
  readonly patternType: 'AND' | 'OR' | 'FOLLOWEDBY' | 'REPEAT' | 'NOT';
}

export class AndPattern extends PatternDefinition {
  patternType: 'AND';
  eventSequenceA: (ConditionedEvent | PatternDefinition)[] = [];
  eventSequenceB: (ConditionedEvent | PatternDefinition)[] = [];
}

export class OrPattern extends PatternDefinition {
  patternType: 'OR';
  eventSequenceA: (ConditionedEvent | PatternDefinition)[] = [];
  eventSequenceB: (ConditionedEvent | PatternDefinition)[] = [];
}

export class RepeatPattern extends PatternDefinition {
  patternType: 'REPEAT';
  times: number;
  eventSequence: (ConditionedEvent | PatternDefinition)[] = [];
}

export class NotPattern extends PatternDefinition {
  patternType: 'NOT';
  eventSequence: (ConditionedEvent | PatternDefinition)[] = [];
}

// TODO: Timer Pattern

abstract class Condition {
  value1: any;
  operator: string;
  value2: any;
}

export class ValueCondition extends Condition {
  value1: string | number;
  operator: '<' | '>' | '=' | '!=' | '>=' | '<=';
  value2: string | number;
}

export class LogicalCondition extends Condition {
  value1: (LogicalCondition | ValueCondition)[] = [];
  operator: 'and' | 'or';
  value2: (LogicalCondition | ValueCondition)[] = [];
}
