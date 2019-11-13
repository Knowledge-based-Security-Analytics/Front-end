import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() debugging = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  toggleChange(event: any) {
    this.debugging.emit(event.checked);
  }

}
