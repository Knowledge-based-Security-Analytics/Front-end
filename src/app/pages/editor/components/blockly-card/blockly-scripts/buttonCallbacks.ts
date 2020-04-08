import { BlocklyService } from './../../../services/blockly.service';
declare var Blockly: any;

export class ButtonCallbacks {

  constructor(private blocklyService: BlocklyService) { }

  public registerButtonCallbacks(): void {
    this.initEventAliasButtonCallback();
  }

  private initEventAliasButtonCallback(): void {
    this.blocklyService.workspace.registerButtonCallback('addEventAliasCallback', () => {
      const eventAlias = prompt('Please enter an event alias');
      if (eventAlias) {
        this.blocklyService.eventAliases.push(eventAlias);
        new Blockly.Events.VarCreate(new Blockly.VariableModel(this.blocklyService.workspace, eventAlias)).run(true);
      }
    });
  }
}
