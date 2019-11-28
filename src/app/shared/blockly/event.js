Blockly.Blocks['event'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Event")
        .appendField(new Blockly.FieldDropdown([["option","OPTIONNAME"], ["option","OPTIONNAME"], ["option","OPTIONNAME"]]), "EVENT_TYPE")
        .appendField("as")
        .appendField(new Blockly.FieldTextInput("default"), "EVENT_ALIAS");
    this.appendValueInput("CONDITION")
        .setCheck("condition")
        .setAlign(Blockly.ALIGN_CENTRE);
    this.setInputsInline(false);
    this.setPreviousStatement(true, 'event');
    this.setNextStatement(true, 'event');
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event_pattern'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Event");
    this.appendStatementInput("EVENT_PATTERN")
        .setCheck( ['event', 'event_pattern_structure'] );
    this.setInputsInline(true);
    this.setNextStatement(true, 'action');
    this.setColour(200);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event_pattern_and'] = {
  init: function() {
    this.appendStatementInput("EVENTS_1")
        .setCheck(['event', 'event_pattern_structure']);
    this.appendDummyInput()
        .appendField("AND");
    this.appendStatementInput("EVENTS_2")
        .setCheck(['event', 'event_pattern_structure']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'event_pattern_structure');
    this.setNextStatement(true, 'event_pattern_structure');
    this.setColour(220);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event_pattern_or'] = {
  init: function() {
    this.appendStatementInput("EVENTS_1")
    .setCheck(['event', 'event_pattern_structure']);
this.appendDummyInput()
    .appendField("OR");
this.appendStatementInput("EVENTS_2")
    .setCheck(['event', 'event_pattern_structure']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'event_pattern_structure');
    this.setNextStatement(true, 'event_pattern_structure');
    this.setColour(220);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event_pattern_not'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("NOT");
    this.appendStatementInput("EVENTS")
        .setCheck(['event', 'event_pattern_structure']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['event', 'event_pattern_structure']);
    this.setNextStatement(true, ['event', 'event_pattern_structure']);
    this.setColour(220);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event_pattern_repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Find")
        .appendField(new Blockly.FieldNumber(1), "COUNT")
        .appendField("time(s)");
    this.appendStatementInput("EVENTS")
        .setCheck( ['event', 'event_pattern_structure']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['event', 'event_pattern_structure']);
    this.setNextStatement(true, ['event', 'event_pattern_structure']);
    this.setColour(220);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
