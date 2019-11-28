const attributes = [['RESOURCE', 'resource'],['URL', 'url'], ['METHOD', 'method'], ['IP', 'ip'], ['RESPONSE', 'response']];
const attributes_star = [['*','*'],['RESOURCE', 'resource'], ['IP', 'ip'], ['URL', 'url'], ['METHOD', 'method'], ['RESPONSE', 'response']];
const previousNext_select = ['average', 'attributes', 'max','count', 'min', 'sum', 'fmax', 'maxever', 'fmaxever', 'median', 'fmin', 'minever', 'fminever', 'stddev'];
const data_types = [['String', 'string'], ['Boolean', 'boolean'], ['Integer', 'integer'], ['Long', 'long'], ['Double', 'double'], ['Float', 'float',]];
const having_attributes = ['average', 'max','count', 'min', 'sum', 'attributes'];

async function getEventTypes() {
   let eventTypes = await (await fetch('http://localhost:8080/api/eventtypes')).json();
   var typeArray = [];
   for (let type of eventTypes) {
     typeArray.push([type,type]);
   }
   return await typeArray;
}

Blockly.Blocks['select'] = {
  init: function() {
    this.appendDummyInput().appendField('Select');
    this.appendStatementInput('SELECT')
      .setCheck(['attributes', 'average']);
    this.appendDummyInput()
      .appendField('From');
    this.appendStatementInput('FROM')
      .setCheck('existing_tables');
    this.setNextStatement(true, ['where', 'time_window', 'length_window', 'group_by', 'having']);
    this.setPreviousStatement('select');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['create'] = {
  // TODO create table, context functionality
  init: function () {
    this.appendDummyInput().appendField('Create');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([['Window', 'window'], ['Table', 'table'], ['Context', 'context'], ['EventType', 'eventtype']], this.handleSelection.bind(this)),'TYPEVALUE')
      .appendField(new Blockly.FieldTextInput('Enter name...'), 'NAME');
    this.appendStatementInput('window')
      .setCheck(['time_window', 'length_window']);
    this.appendDummyInput('source')
      .appendField('as data source:');
    this.setNextStatement(true, ['existing_tables']);
    this.setColour(230);
    this.columnType = this.getFieldValue('TYPEVALUE')
  },
  handleSelection: function(newType) {
    if (newType === 'table' || newType === 'eventtype') {
      this.removeInput('window');
      this.removeInput('source');
      this.appendDummyInput('with_columns')
        .appendField('with columns:');
      this.appendStatementInput('data_fields')
        .setCheck('table_column');
      this.setNextStatement(false);
    } else if (newType === 'context') {
      this.removeInput('window');
      this.removeInput('source');
      this.removeInput('with_columns');
      this.removeInput('data_fields');
      this.setNextStatement(false);
      this.appendDummyInput()
        .appendField('start @now end after:');
      this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), 'TIME')
        .appendField(new Blockly.FieldDropdown([['Seconds', 'sec'], ['Minutes', 'min'], ['Hours', 'hours'], ['Days', 'days']]), 'RANGE')
    } else if (newType === 'window') {
      this.removeInput('with_columns');
      this.removeInput('data_fields');
      this.appendStatementInput('window')
        .setCheck(['time_window', 'length_window']);
      this.appendDummyInput('source')
        .appendField('as data source:');
    }
  }
};

Blockly.Blocks['context'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Context:')
      .appendField(new Blockly.FieldTextInput('Enter name...'), 'NAME');
    this.appendDummyInput()
      .appendField('(add SELECT statement:)');
    this.setNextStatement(true, ['select']);
    this.setColour(230);
  }
};

Blockly.Blocks['table_column'] = {
  init: function () {
    this.appendDummyInput().appendField('Table column');
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('Enter column name...'), 'NAME')
      .setAlign(Blockly.ALIGN_RIGHT)
      .appendField(new Blockly.FieldDropdown(data_types), 'COLUMNTYPE');
    this.appendDummyInput()
      .appendField('Primary key:')
      .appendField(new Blockly.FieldCheckbox('primary_key'), 'primary_key');
    this.setColour(230);
    this.setPreviousStatement(['table_column']);
    this.setNextStatement(['table_column']);
  }
};

Blockly.Blocks['insert_into'] = {
  init: function () {
    this.appendDummyInput().appendField('Insert into');
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('Enter window or table...'), 'NAME');
    this.appendDummyInput('select')
      .appendField('Add select stmt:');
    this.setNextStatement(true, 'select');
    this.setColour(230);
  }
};

Blockly.Blocks['existing_tables'] = {
  init: async function() {
    this.appendDummyInput()
      .appendField('Data source');
    this.setPreviousStatement(true, 'existing_tables');
    this.setNextStatement(false);
    let x =await getEventTypes();
    this.appendDummyInput('input')
      .appendField(new Blockly.FieldDropdown(x), 'TABLE');
    //this.setup();
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  },
  setup: async function() {
    if (this.getInput('input') === null) {
      let x =await getEventTypes();
      this.appendDummyInput('input')
        .appendField(new Blockly.FieldDropdown(x), 'TABLE');
    }
  }
};

Blockly.Blocks['attributes'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Existing attributes');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes_star),'ATTRIBUTE');
    this.setPreviousStatement(true, previousNext_select);
    this.setNextStatement(true, previousNext_select);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['where'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Where clause');
    this.appendStatementInput('ATTRIBUTES')
      .setCheck('where_attributes');
    this.setPreviousStatement(true, 'where');
    this.setNextStatement(true, ['having', 'limit', 'order_by', 'group_by']);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
Blockly.Blocks['where_attributes'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('attributes for where block');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes), 'WHEREATTR')
      .appendField(new Blockly.FieldDropdown([['<','<'], ['>','>'], ['<=', '<='], ['>=', '>='], ['=', '=']]), 'OPERATOR')
      .appendField(new Blockly.FieldTextInput('Enter value...'), 'VALUE');
    this.setPreviousStatement(true, ['where_attributes']);
    this.setNextStatement(true, ['where_attributes']);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['having'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('having');
    this.appendStatementInput('ATTRIBUTES')
      .setCheck(having_attributes);
    this.appendDummyInput('operator')
      .appendField(new Blockly.FieldDropdown([['<','<'], ['>','>'], ['<=', '<='], ['>=', '>='], ['=', '=']]), 'OPERATOR');
    this.appendDummyInput('value')
      .appendField(new Blockly.FieldTextInput('Type in...'), 'VALUE');
    this.setPreviousStatement(true, ['where', 'select']);
    this.setNextStatement(true, ['having','output']);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['time_window'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Specify time window in s');
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), 'TIME');
    this.setPreviousStatement(true, ['where', 'time_window']);
    this.setNextStatement(true, ['limit','having', 'group_by']);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['length_window'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Specify length window in #events:');
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), 'LENGTH');
    this.setPreviousStatement(true, ['where', 'length_window']);
    this.setNextStatement(true);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly. Blocks['output'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('output');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([['All', 'all'],['First', 'first'], ['Last', 'last'], ['Snapshot', 'snapshot']]), 'WHENATTR');
    this.appendDummyInput()
      .appendField('every');
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), 'OUTPUTRATE')
      .appendField(new Blockly.FieldDropdown([['Seconds', 'seconds'],['Events', 'events']]), 'TYPE');
    this.setPreviousStatement(true, ['group_by', 'time_window', 'length_window', 'where', 'limit', 'order_by', 'having']);
    this.setNextStatement(false);
    this.setColour(230);
  }
}

Blockly.Blocks['group_by'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Group By: ');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes), 'GROUPATTR');
    this.setPreviousStatement(true, ['where', 'group_by', 'select']);
    this.setNextStatement(true, ['order_by', 'limit', 'having']);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['order_by'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Order By: ');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes), 'ORDERATTR');
    this.setPreviousStatement(true, 'order_by');
    this.setNextStatement(true, 'limit');
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['limit'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('Limit: ');
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), 'LIMITATTR');
    this.setPreviousStatement(true, 'limit');
    this.setNextStatement(false);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

// Aggregation Blocks

Blockly.Blocks['average'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('AVG:');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes), 'AVGATTR');
    this.setPreviousStatement(true, previousNext_select);
    this.setNextStatement(true, previousNext_select);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['count'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('COUNT:');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes_star), 'COUNTATTR');
    this.setPreviousStatement(true, previousNext_select);
    this.setNextStatement(true, previousNext_select);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['max'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('MAX:');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes), 'MAXATTR');
    this.setPreviousStatement(true, previousNext_select);
    this.setNextStatement(true, previousNext_select);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['min'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('MIN:');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes), 'MINATTR');
    this.setPreviousStatement(true, previousNext_select);
    this.setNextStatement(true, previousNext_select);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['sum'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('SUM:');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(attributes), 'SUMATTR');
    this.setPreviousStatement(true, previousNext_select);
    this.setNextStatement(true, previousNext_select);
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
