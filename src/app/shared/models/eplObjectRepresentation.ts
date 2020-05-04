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

export abstract class PatternDefinition {
  readonly patternType: 'AND' | 'OR' | 'REPEAT' | 'NOT';
}

export class AndPattern extends PatternDefinition {
  patternType: 'AND' = 'AND';
  eventSequenceA: (ConditionedEvent | PatternDefinition)[] = [];
  eventSequenceB: (ConditionedEvent | PatternDefinition)[] = [];
}

export class OrPattern extends PatternDefinition {
  patternType: 'OR' = 'OR';
  eventSequenceA: (ConditionedEvent | PatternDefinition)[] = [];
  eventSequenceB: (ConditionedEvent | PatternDefinition)[] = [];
}

export class RepeatPattern extends PatternDefinition {
  patternType: 'REPEAT' = 'REPEAT';
  times: number;
  eventSequence: (ConditionedEvent | PatternDefinition)[] = [];
}

export class NotPattern extends PatternDefinition {
  patternType: 'NOT' = 'NOT';
  eventSequence: (ConditionedEvent | PatternDefinition)[] = [];
}

// TODO: Timer Pattern

export abstract class Condition {
  type: 'value' | 'logical';
  value1: any;
  operator: string;
  value2: any;
}

export class ValueCondition extends Condition {
  type: 'value' = 'value';
  value1: string | number;
  operator: '<' | '>' | '=' | '!=' | '>=' | '<=';
  value2: string | number;
}

export class LogicalCondition extends Condition {
  type: 'logical' = 'logical';
  value1: (LogicalCondition | ValueCondition) = null;
  operator: 'and' | 'or';
  value2: (LogicalCondition | ValueCondition) = null;
}
