Blockly.Blocks['condition'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Condition");
    this.appendStatementInput("CONDITIONS")
        .setCheck("condition");
    this.setOutput(true, "condition");
    this.setColour(100);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
