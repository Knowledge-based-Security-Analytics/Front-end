import { EventStreamService } from './../../services/event-stream.service';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MatList } from '@angular/material/list';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.css']
})
export class DebuggerComponent implements OnInit {
  @ViewChildren(MatList) lists: QueryList<any>;

  public logs: string[] = [];
  public events: string[] = ['sdfasfd', 'asdfasfd', 'Oct 11 22:14:15 su: \'su root\' failed for lonvick on /dev/pts/8', 'asdfasfd'];
  public incidents: string[] = [];

  constructor(private eventStreamService: EventStreamService) {
    let i = 0;
    this.eventStreamService.subscribeTopic('test').subscribe(event => {
      console.log(event);
      this.logs.unshift(i + event.jsonString);
      i++;
      console.log(this.lists);
    });
  }

  ngOnInit() {
    console.log(this.lists);
  }

}
