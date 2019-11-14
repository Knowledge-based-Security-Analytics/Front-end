import { Component, OnInit } from '@angular/core';

declare var Blockly: any;

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.css']
})
export class BlocklyComponent implements OnInit {
  private selectStatements: any[] = [];
  private createStatements: any[] = [];
  private insertStatements: any[] = [];
  statement: any;
  statementFunctionName: String = 'Create statement';
  messageHistory = [];
  public workspacePlayground: any;
  public toolbox: String =
    '<xml id="toolbox" style="display: none">' +
    '<category name="COMMANDS">' +
    '<block type="select"></block>' +
    '<block type="create"></block>' +
    '<block type="insert_into"></block>' +
    '<block type="context"></block>' +
    '</category>' +
    '<category name="FIELDS">' +
    '<block type="existing_tables"></block>' +
    '<block type="attributes"></block>' +
    '<block type="where"></block>' +
    '<block type="where_attributes"></block>' +
    '<block type="table_column"></block>' +
    '<block type="time_window"></block>' +
    '<block type="length_window"></block>' +
    '<block type="output"></block>' +
    '</category>' +
    '<category name="AGGREGATION">' +
      '<block type="group_by"></block>' +
      '<block type="order_by"></block>' +
      '<block type="limit"></block>' +
      '<block type="having"></block>' +
      '<block type="average"></block>' +
      '<block type="max"></block>' +
      '<block type="min"></block>' +
      '<block type="count"></block>' +
      '<block type="sum"></block>' +
    '</category>' +
    '</xml>';

  constructor() { }

  ngOnInit() {
    const blocklyDiv = document.getElementById('blocklyDiv');
    this.workspacePlayground = Blockly.inject(blocklyDiv,
    {toolbox: this.toolbox});
  }

}
