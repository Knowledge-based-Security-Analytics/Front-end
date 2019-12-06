import { StatementService } from 'src/app/services/statement.service';
import { EPLParsed } from 'src/app/models/statemet';

declare var Blockly: any;

export class BlocklyBlocks {
  public workspace: any;

  private stmtService: StatementService;
  private statements: EPLParsed[];
  private eventTypes: string[] = [];
  private eventAliases: string[] = [];
  private toolbox = `
    <xml id="toolbox" style="display: none">
      <category name ="EVENT SCHEMAS" colour="20">
        <label text="Create new schema"></label>
        <block type="type"></block>
        <sep gap="8"></sep>
        <block type="attribute_definition"></block>
        <label text="Existing schemas"></label>
      </category>
      <category name="ALIASES" custom="ALIASES" colour="65"></category>
      <sep></sep>
      <category name="EVENT" colour="200">
        <block type="event"></block>
        <sep gap="32"></sep>
        <block type="event_pattern"></block>
        <sep gap="32"></sep>
        <block type="event_pattern_and"></block>
        <sep gap="8"></sep>
        <block type="event_pattern_or"></block>
        <sep gap="8"></sep>
        <block type="event_pattern_not"></block>
        <sep gap="8"></sep>
        <block type="event_pattern_repeat"></block>
      </category>
      <category name="CONDITION" colour="100">
        <block type="condition"></block>
      </category>
      <category name="ACTION" colour="300">
        <block type="action"></block>
      </category>
    </xml>`;

  constructor(stmtService: StatementService) {
    this.stmtService = stmtService;
    this.stmtService.statementsObservable.subscribe( newStatements => {
      this.statements = newStatements.filter(statement => statement.eventType).map(statement => statement.eplParsed);
      this.statements.map(statement => this.eventTypes.push(statement.name));
    });
  }

  public initBlockly(): void {
    const blocklyDiv = document.getElementById( 'blocklyDiv' );
    this.workspace = Blockly.inject(
      blocklyDiv,
      {
        toolbox: this.toolbox,
        grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
        trashcan: true,
        scrollbars: false,
        zoom: {
          controls: true,
          wheel: false,
        }
      });
    this.initChangeListeners();
    this.initButtonCallbacks();
    this.initCategoryCallbacks();
    this.initBlocks();
  }

  private initBlocks(): void {
    this.initEventTypeBlocks();
    this.initPatternBlocks();
    this.initConditionBlocks();
    this.initActionBlocks();
    this.initVariableBlocks();
  }

  private initEventTypeBlocks(): void {
    Blockly.Blocks.type = {
      init() {
        this.appendDummyInput()
            .appendField('Event Type:')
            .appendField(new Blockly.FieldDropdown([['atomic', 'SIMPLE_TYPE'], ['complex', 'COMPLEX_TYPE']]), 'EVENT_TYPE')
            .appendField(new Blockly.FieldTextInput('type_name'), 'TYPE_NAME');
        this.appendStatementInput('ATTRIBUTES')
            .setCheck('attribute_definition');
        this.setColour(20);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.attribute_definition = {
      init() {
        this.appendDummyInput()
            .appendField('Attribute:')
            .appendField(new Blockly.FieldTextInput('name'), 'ATTRIBUTE_NAME')
            .appendField(', Type: ')
            .appendField(new Blockly.FieldDropdown([
              ['Integer', 'int'],
              ['Float', 'double'],
              ['Text', 'string'],
              ['Boolean', 'boolean']]), 'ATTRIBUTE_TYPE');
        this.setPreviousStatement(true, 'attribute_definition');
        this.setNextStatement(true, 'attribute_definition');
        this.setColour(40);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_alias = {
      init() {
        this.appendDummyInput()
          .appendField(new Blockly.FieldLabelSerializable(''), 'ALIAS');
        this.setOutput(true, null);
        this.setColour(65);
        this.setTooltip('');
      }
    };
  }

  private initPatternBlocks(): void {
    const env: any = this;
    Blockly.Blocks.event = {
      init() {
        const dropDownData = env.eventTypes.map((type: any) => [type, type]);
        this.appendDummyInput()
          .appendField('Event')
          .appendField(new Blockly.FieldDropdown(dropDownData), 'EVENT_TYPE')
          .appendField('as')
          .appendField(new Blockly.FieldVariable('eventAlias'), 'EVENT_ALIAS');
        this.appendValueInput('CONDITION')
          .setCheck('condition')
          .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, 'event');
        this.setNextStatement(true, 'event');
        this.setColour(230);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern = {
      init() {
        this.appendDummyInput()
          .appendField('Tansform');
        this.appendStatementInput('EVENT_PATTERN')
          .setCheck( ['event', 'event_pattern_structure'] );
        this.setInputsInline(true);
        this.setNextStatement(true, 'action');
        this.setColour(200);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern_and = {
      init() {
        this.appendStatementInput('EVENTS_1')
          .setCheck(['event', 'event_pattern_structure']);
        this.appendDummyInput()
          .appendField('AND');
        this.appendStatementInput('EVENTS_2')
          .setCheck(['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'event_pattern_structure');
        this.setNextStatement(true, 'event_pattern_structure');
        this.setColour(220);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern_or = {
      init() {
        this.appendStatementInput('EVENTS_1')
          .setCheck(['event', 'event_pattern_structure']);
        this.appendDummyInput()
          .appendField('OR');
        this.appendStatementInput('EVENTS_2')
          .setCheck(['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'event_pattern_structure');
        this.setNextStatement(true, 'event_pattern_structure');
        this.setColour(220);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern_not = {
      init() {
        this.appendDummyInput()
          .appendField('NOT');
        this.appendStatementInput('EVENTS')
          .setCheck(['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, ['event', 'event_pattern_structure']);
        this.setNextStatement(true, ['event', 'event_pattern_structure']);
        this.setColour(220);
        this.setTooltip('');
      }
    };

    Blockly.Blocks.event_pattern_repeat = {
      init() {
        this.appendDummyInput()
          .appendField('Find')
          .appendField(new Blockly.FieldNumber(1), 'COUNT')
          .appendField('time(s)');
        this.appendStatementInput('EVENTS')
          .setCheck( ['event', 'event_pattern_structure']);
        this.setInputsInline(true);
        this.setPreviousStatement(true, ['event', 'event_pattern_structure']);
        this.setNextStatement(true, ['event', 'event_pattern_structure']);
        this.setColour(220);
        this.setTooltip('');
      }
    };
  }

  private initConditionBlocks(): void {
    Blockly.Blocks.condition = {
      init() {
        this.appendDummyInput()
          .appendField('Condition');
        this.appendStatementInput('CONDITIONS')
          .setCheck('condition');
        this.setOutput(true, 'condition');
        this.setColour(100);
        this.setTooltip('');
      }
    };
  }

  private initActionBlocks(): void {
    const env: any = this;
    Blockly.Blocks.action = {
      init() {
        this.appendDummyInput()
          .appendField('to');
        this.appendStatementInput('ACTIONS')
          .setCheck('test');
        this.setInputsInline(true);
        this.setPreviousStatement(true, 'action');
        this.setColour(300);
        this.setTooltip('');
      }
    };
  }

  private initVariableBlocks(): void {
    const env: any = this;
  }

  public initChangeListeners(): void {
    this.initPreviewChangeListener();
  }

  public initPreviewChangeListener(): void {
    this.workspace.addChangeListener(() => {
      document.getElementById( 'blocklyOutput' ).innerHTML = Blockly.EPL.workspaceToCode(this.workspace);
    });
  }

  public initButtonCallbacks(): void {
    this.initEventAliasButtonCallback();
  }

  private initEventAliasButtonCallback(): void {
    this.workspace.registerButtonCallback('addEventAliasCallback', () => {
      const eventAlias = prompt('Please enter an event alias');
      if (eventAlias) {
        this.eventAliases.push(eventAlias);
        const test = new Blockly.VariableModel(this.workspace, eventAlias);
        new Blockly.Events.VarCreate(test).run(true);
      }
    });
  }

  public initCategoryCallbacks(): void {
    this.initAliasesCategoryCallback();
  }

  private initEventSchemaCategoryCallback(): void {
    this.workspace.registerToolboxCategoryCallback('EVENT SCHEMAS', () => {
      const xmlList = [];
      xmlList.push(Blockly.Xml.textToDom(
        '<label text="Create new schema"></label>' +
        '<block type="type"></block>' +
        '<sep gap="8"></sep>' +
        '<block type="attribute_definition"></block>' +
        '<label text="Existing schemas"></label>'));

      return xmlList;
    });
  }

  private initAliasesCategoryCallback(): void {
    this.workspace.registerToolboxCategoryCallback('ALIASES', () => {
      const xmlList = [];
      xmlList.push(Blockly.Xml.textToDom('<button text="Add event alias" callbackKey="addEventAliasCallback"></button>'));
      if ( this.workspace.variableMap_.variableMap_[''] ) {
        this.workspace.variableMap_.variableMap_[''].map((variable: any) =>  {
          xmlList.push(Blockly.Xml.textToDom(`<block type="event_alias"><field name="ALIAS">${variable.name}</field></block>`));
        });
      }
      return xmlList;
    });
  }

}
