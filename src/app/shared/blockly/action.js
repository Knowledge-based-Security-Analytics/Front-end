Blockly.Blocks['action'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Action");
    this.appendStatementInput("ACTIONS")
        .setCheck("test");
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'action');
    this.setColour(300);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
