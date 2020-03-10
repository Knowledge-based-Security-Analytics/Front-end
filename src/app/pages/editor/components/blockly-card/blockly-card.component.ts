import { BlocklyService } from '../../services/blockly.service';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-blockly-card',
  templateUrl: './blockly-card.component.html',
  styleUrls: ['./blockly-card.component.scss']
})
export class BlocklyCardComponent implements AfterViewInit {
  @ViewChild('blocklyDiv', {static: false}) blocklyDiv: ElementRef;

  constructor( private blocklyService: BlocklyService) { }

  ngAfterViewInit() {
    this.blocklyService.initBlockly(this.blocklyDiv);
  }
}
