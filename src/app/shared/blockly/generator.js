(function() {
  Blockly.EPL = new Blockly.Generator('EPL');

  Blockly.EPL.addReservedWords(
    // SQL Keywords
    "SELECT", "INSERT", "UPDATE", "ALL", "DISTINCT", "AS", "INTO",
    "FROM", "VALUES", "WHERE", "SET", "GOUP BY", "ORDER BY", "HAVING",
    "LIMIT", "AVG", "COUNT", "MIN", "MAX", "STDDEV", "SUM", "VARIANCE",
    "ASC", "DESC", "AS"
  );

  Blockly.EPL.scrub_ = function(block, code) {
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      var comment = block.getCommentText();
      comment = Blockly.utils.wrap(comment, Blockly.EPL.COMMENT_WRAP - 3);
      if (comment) {
        if (block.getProcedureDef) {
          // Use a comment block for function comments.
          commentCode += '/**\n' +
            Blockly.EPL.prefixLines(comment + '\n', ' * ') +
            ' */\n';
        } else {
          commentCode += Blockly.EPL.prefixLines(comment + ' */\n', '/* ');
        }
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (var i = 0; i < block.inputList.length; i++) {
        if (block.inputList[i].type === Blockly.INPUT_VALUE) {
          var childBlock = block.inputList[i].connection.targetBlock();
          if (childBlock) {
            var comment = Blockly.EPL.allNestedComments(childBlock);
            if (comment) {
              commentCode += Blockly.EPL.prefixLines(comment + ' */\n', '/* ');
            }
          }
        }
      }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = Blockly.EPL.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  };

  Blockly.EPL.finish = function(code) {
    // Clean up temporary data.
   Blockly.EPL.variableDB_.reset();

    return code.trim();
  };

  Blockly.EPL.init = function(a) {
    Blockly.EPL.definitions_=Object.create(null);
    Blockly.EPL.functionNames_=Object.create(null);
    Blockly.EPL.variableDB_ ? Blockly.EPL.variableDB_.reset() : Blockly.EPL.variableDB_ = new Blockly.Names(Blockly.EPL.RESERVED_WORDS_);
    var b=[];
    a=a.variableList;
    if(a.length){
      for(var c=0;c<a.length;c++)
        b[c]=Blockly.EPL.variableDB_.getName(a[c],Blockly.Variables.NAME_TYPE);
      Blockly.EPL.definitions_.variables="var "+b.join(", ")+";"};
  };
})();
