import { StatementService } from 'src/app/services/statement.service';
import { EventStreamService } from './../../services/event-stream.service';
import { Component, OnInit, ViewChildren, QueryList, Input } from '@angular/core';
import { MatList } from '@angular/material/list';
import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.css']
})
export class DebuggerComponent implements OnInit {
  @Input() statement: Statement;

  public events: string[][] = [];

  constructor(private eventStreamService: EventStreamService, private statementService: StatementService) {
    // this.eventStreamService.subscribeTopic('LogEvent').subscribe(event => {
    //   console.log(event);
    //   this.logs.unshift(i + event.jsonString);
    //   i++;
    // });
    // this.eventStreamService.subscribeTopic('PortScanEvent').subscribe(event => {
    //   console.log(event);
    //   this.events.unshift(i + event.jsonString);
    //   i++;
    // });
  }

  ngOnInit() {
    this.subscribeTopics();
  }

  private async subscribeTopics() {
    const statementsIt: Statement[] = [];
    statementsIt[0] = this.statement;
    let i = 0;
    outerWhile:
    while (this.events.length <= 3) {
      const eventsLog = [];
      this.events.unshift(eventsLog);
      for (const statementIt of statementsIt) {
        console.log('subscribe to ' + statementIt.eplParsed.name);
        console.log(i);
        this.eventStreamService.subscribeTopic(statementIt.eplParsed.name).subscribe((event) => {
          eventsLog.unshift(i + event.jsonString);
          console.log(this.events);
        });
        statementsIt.length = 0;
        for (const deploymentId of statementIt.deploymentDependencies) {
          statementsIt.push(this.statementService.getStatement(deploymentId));
        }
        if (statementsIt.length === 0) {
          break outerWhile;
        }
        i++;
      }
    }
  }

}
