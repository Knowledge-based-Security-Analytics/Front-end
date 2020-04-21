import { ButtonCallbacks } from './blockly-scripts/buttonCallbacks';
import { ToolboxCallbacks } from './blockly-scripts/toolboxCallbacks';
import { BlockInitializers } from './blockly-scripts/blockInitializers';
import { BlockParsers } from './blockly-scripts/blockParsers';
import { BlocklyService } from '../../services/blockly.service';
import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { StatementService } from 'src/app/shared/services/statement.service';

declare var Blockly: any;

@Component({
  selector: 'app-blockly-card',
  templateUrl: './blockly-card.component.html',
  styleUrls: ['./blockly-card.component.scss']
})
export class BlocklyCardComponent implements OnInit, AfterViewInit {
  @ViewChild('blocklyDiv', {static: false}) blocklyDiv: ElementRef;
  private blocklyParsers: BlockParsers;
  private blocklyBlocks: BlockInitializers;
  private blocklyToolboxCallbacks: ToolboxCallbacks;
  private blocklyButtonCallbacks: ButtonCallbacks;

  constructor(
    private blocklyService: BlocklyService,
    private stmtService: StatementService ) {
    this.blocklyBlocks = new BlockInitializers(this.blocklyService, this.stmtService);
    this.blocklyParsers = new BlockParsers(this.blocklyService, this.stmtService);
    this.blocklyToolboxCallbacks = new ToolboxCallbacks(this.blocklyService, this.stmtService);
    this.blocklyButtonCallbacks = new ButtonCallbacks(this.blocklyService);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.blocklyService.workspace = this.injectBlockly();
    this.blocklyBlocks.initBlocks();
    this.blocklyParsers.initParsers();
    this.blocklyToolboxCallbacks.registerToolboxCategoryCallbacks();
    this.blocklyButtonCallbacks.registerButtonCallbacks();
    this.blocklyService.initPreviewChangeListener();
  }

  private injectBlockly(): any {
    return Blockly.inject(
      this.blocklyDiv.nativeElement,
      {
        toolbox: this.blocklyService.statementType === 'schema' ? this.blocklyService.toolboxSchema : this.blocklyService.toolboxPattern,
        // grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
        trashcan: true,
        scrollbars: false,
        zoom: {
          controls: true,
          wheel: false,
        }
      });
  }
}
