export const DOUBLE_SEQUENCE_PATTERN = {
  expression1: 'EVENTS_1',
  expression2: 'EVENTS_2'
};
export const SINGLE_SEQUENCE_PATTERN = {
  expression1: 'EVENTS'
};

export const BLOCKS = {
  attribute: {
    name: 'ATTRIBUTE',
    fields: {
      name: 'ATTRIBUTE_NAME',
      type: 'ATTRIBUTE_TYPE',
    },
  },
  eventAlias: {
    name: 'EVENT_ALIAS',
    fields: {
      alias: 'ALIAS',
      attribute: 'ATTRIBUTE',
    }
  },
  sequencePattern: {
    name: 'EVENT_PATTERN_SEQUENCE',
    fields: {
      type: 'EVENT_TYPE',
      alias: 'EVENT_ALIAS',
    },
    statements: {
      condition: 'CONDITION',
      conditionCheck: 'CONDITION'
    },
  },
  andPattern: {
    name: 'EVENT_PATTERN_AND',
    statements: DOUBLE_SEQUENCE_PATTERN
  },
  orPattern: {
    name: 'EVENT_PATTERN_OR',
    statements: DOUBLE_SEQUENCE_PATTERN
  },
  notPattern: {
    name: 'EVENT_PATTERN_NOT',
    statements: SINGLE_SEQUENCE_PATTERN
  },
  repeatPattern: {
    name: 'EVENT_PATTERN_REPEAT',
    fields: {
      repeatCount: 'COUNT'
    },
    statements: SINGLE_SEQUENCE_PATTERN
  },
  action: {
    name: 'ACTION',
    fields: {
      outputSchema: 'EVENT_SCHEMA',
    },
    statements: {
      outputVariables: 'ACTIONS',
    }
  },
  outputSchema: {
    name: 'EXISTING_SCHEMA',
    fields: {
      schema: 'SCHEMA',
    }
  },
  orCondition: {
    name: 'CONDITION_OR',
    statements: {
      expression1: 'CONDITION_1',
      expression2: 'CONDITION_2'
    }
  },
  andCondition: {
    name: 'CONDITION_AND',
    statements: {
      expression1: 'CONDITION_1',
      expression2: 'CONDITION_2'
    }
  },
  condition: {
    name: 'CONDITION',
    fields: {
      leftInput: 'LEFT',
      operator: 'LOGICAL_OPERATOR',
      rightInput: 'RIGHT'
    }
  },
  conditionTextInput: {
    name: 'CONDITION_TEXT_INPUT',
    fields: {
      textInput: 'TEXT_INPUT'
    }
  },
  conditionNumberInput: {
    name: 'CONDITION_NUMBER_INPUT',
    fields: {
      numberInput: 'NUMBER_INPUT'
    }
  }
};

export const PATTERN_STRUCTURE = [
  BLOCKS.sequencePattern.name,
  BLOCKS.andPattern.name,
  BLOCKS.orPattern.name,
  BLOCKS.notPattern.name,
  BLOCKS.repeatPattern.name,
];
