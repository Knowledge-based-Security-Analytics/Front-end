Blockly.Blocks['type'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Event Type:")
        .appendField(new Blockly.FieldDropdown([["atomic","SIMPLE_TYPE"], ["complex","COMPLEX_TYPE"]]), "EVENT_TYPE")
        .appendField(new Blockly.FieldTextInput("type_name"), "TYPE_NAME");
    this.appendStatementInput("ATTRIBUTES")
        .setCheck("attribute_definition");
    this.setColour(20);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['attribute_definition'] = {
  init() {
    this.appendDummyInput()
        .appendField("Attribute:")
        .appendField(new Blockly.FieldTextInput("name"), "ATTRIBUTE_NAME")
        .appendField(", Type: ")
        .appendField(new Blockly.FieldDropdown([["numeric (int)","int"], ["numeric (float)","double"], ["textual","string"], ["binary","boolean"]]), "ATTRIBUTE_TYPE");
    this.setPreviousStatement(true, "attribute_definition");
    this.setNextStatement(true, "attribute_definition");
    this.setColour(40);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
