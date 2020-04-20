import { DEFAULT_THEME as baseTheme } from '@nebular/theme';

export const THEME_VARIABLES = baseTheme.variables;

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
    },
  },
  andPattern: {
    name: 'EVENT_PATTERN_AND',
    statements: {
      expression1: 'EVENTS_1',
      expression2: 'EVENTS_2'
    }
  },
  orPattern: {
    name: 'EVENT_PATTERN_OR',
    statements: {
      expression1: 'EVENTS_1',
      expression2: 'EVENTS_2'
    }
  },
  notPattern: {
    name: 'EVENT_PATTERN_NOT',
    statements: {
      expression1: 'EVENTS',
    }
  },
  repeatPattern: {
    name: 'EVENT_PATTERN_REPEAT',
    fields: {
      repeatCount: 'COUNT'
    },
    statements: {
      expression1: 'EVENTS',
    }
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
  }
};

export const PATTERN_STRUCTURE = [
  BLOCKS.sequencePattern.name,
  BLOCKS.andPattern.name,
  BLOCKS.orPattern.name,
  BLOCKS.notPattern.name,
  BLOCKS.repeatPattern.name,
];
