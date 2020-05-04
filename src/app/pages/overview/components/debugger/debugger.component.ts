import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Pattern, Schema, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { StatementService } from 'src/app/shared/services/statement.service';
import { EventStreamService } from 'src/app/shared/services/event-stream.service';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit, OnChanges {
  @Input() statement: Statement;
  public events: {name: string, body: string}[][] = [[], [], []];

  constructor(
    private eventStreamService: EventStreamService,
    private statementService: StatementService) {}

  ngOnInit() {
  }

  ngOnChanges(){
    console.log(this.statement);
    if(this.statement){
      this.subscribeTopics();
    }
  }

  private async subscribeTopics() {
    this.subscribeTopic(this.statement, 2);

    let statementIDs: string[] = this.statement.deploymentProperties.dependencies;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < statementIDs.length; i++) {
      const statementToSubscribe = this.statementService.getStatement(statementIDs[i]);
      if (statementToSubscribe.deploymentProperties.dependencies && statementToSubscribe.deploymentProperties.dependencies.length > 0) {
        statementIDs = statementIDs.concat(statementToSubscribe.deploymentProperties.dependencies);
        this.subscribeTopic(statementToSubscribe, 1);
      } else {
        this.subscribeTopic(statementToSubscribe, 0);
      }
    }
  }

  private subscribeTopic(statement: Statement, position: number) {
    console.log(statement)
    console.log(this.events)
    this.eventStreamService.subscribeTopic(statement.name).subscribe((event) => {
      console.log(event)
      this.events[position].unshift({name: statement.name, body: event.jsonString});
    });
  }

}
