import { Statement } from './../../../models/statemet';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css']
})
export class StatementComponent implements OnInit {
  @Input() statement: Statement;

  constructor() { }

  ngOnInit() {
  }

}
