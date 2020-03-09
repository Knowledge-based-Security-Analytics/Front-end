import { BlocklyService } from './../../services/blockly.service';
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-blockly',
  templateUrl: './blockly.component.html',
  styleUrls: ['./blockly.component.scss']
})
export class BlocklyComponent implements AfterViewInit {
  @ViewChild('blocklyDiv', {static: false}) blocklyDiv: ElementRef;

  constructor( private blocklyService: BlocklyService) { }

  ngAfterViewInit() {
    this.blocklyService.initBlockly(this.blocklyDiv);
  }
}
