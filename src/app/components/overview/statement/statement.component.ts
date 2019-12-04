import { EventStreamService } from './../../../services/event-stream.service';
import { Statement } from './../../../models/statemet';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.css']
})
export class StatementComponent implements OnInit {
  @Output() alerted = new EventEmitter<number>();

  @Input() statement: Statement;

  constructor(private eventStreamService: EventStreamService) { }

  ngOnInit() {
    this.eventStreamService.subscribeTopic(this.statement.eplParsed.name).subscribe(event => {
      if (!this.statement.alertCount) {
        this.statement.alertCount = 0;
      }
      this.statement.alertCount++;
      this.alerted.emit(this.statement.alertCount);
    });
  }

}
