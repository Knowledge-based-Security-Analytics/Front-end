import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Pattern, Schema, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { StatementService } from 'src/app/shared/services/statement.service';
import { EventStreamService } from 'src/app/shared/services/event-stream.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit, OnChanges {
  @Input() statement: Statement;
  public events: {name: string, body: string}[][] = [[], [], []];
  public eventSubscribed = [false, false, true];

  private subscriptions: Subscription[] = [];

  constructor(
    private eventStreamService: EventStreamService,
    private statementService: StatementService) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.statement && this.statement) {
      this.resetTopics();
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
        this.eventSubscribed[1] = true;
      } else {
        this.subscribeTopic(statementToSubscribe, 0);
        this.eventSubscribed[0] = true;
      }
    }
  }

  private subscribeTopic(statement: Statement, position: number) {
    const topic: string = this.getOutputTopic(statement);
    console.log('subscribing to: ' + topic);
    this.subscriptions.push(this.eventStreamService.subscribeTopic(topic).subscribe((event) => {
      console.log(event);
      this.events[position].unshift({name: topic, body: event.jsonString});
    }));
  }

  private resetTopics() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.events = [[], [], []];
    this.eventSubscribed = [false, false, true];
  }

  private getOutputTopic(statement: Statement): string {
    let topic: string = statement.name;
    if (statement.deploymentProperties.eplStatement.includes('@KafkaOutput')) {
      topic = statement.deploymentProperties.eplStatement.match(/@KafkaOutput\('.*?'\)/)[0];
      topic = topic
        .slice(14, -2);
    }
    return topic;
  }
}
