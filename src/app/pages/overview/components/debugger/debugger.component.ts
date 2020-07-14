import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Pattern, Schema, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { StatementService } from 'src/app/shared/services/statement.service';
import { EventStreamService } from 'src/app/shared/services/event-stream.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() statement: Statement;
  public events: {name: string, body: any, id: number, highlighted: boolean}[][] = [[], [], []];
  public eventSubscribed = [false, false, true];
  public expanded = false;

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

  ngOnDestroy(): void {
    this.unsubscribeTopics();
  }

  private async subscribeTopics() {
    this.subscribeTopic(this.statementService.getOutputTopic(this.statement), 2);

    let statementIDs: string[] = this.statement.deploymentProperties.dependencies;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < statementIDs.length; i++) {
      const statementToSubscribe = this.statementService.getStatement(statementIDs[i]);
      if (!statementToSubscribe) {
        continue;
      }
      const parentPatterns = this.statementService.getStatementsWithOutput(statementToSubscribe.outputName);
      if (parentPatterns && parentPatterns.length > 0) {
        parentPatterns.forEach(parentPattern => {
          statementIDs = statementIDs.concat(parentPattern.deploymentProperties.dependencies.map(dependency => {
            if (!statementIDs.includes(dependency)) {
              return dependency;
            }
          }));
        });
        this.subscribeTopic(statementToSubscribe.outputName, 1);
        this.eventSubscribed[1] = true;
      } else {
        this.subscribeTopic(statementToSubscribe.outputName, 0);
        this.eventSubscribed[0] = true;
      }
    }
  }

  private subscribeTopic(topic: string, position: number) {
    console.log('subscribing to ' + topic + ' in column ' + position);
    this.subscriptions.push(this.eventStreamService.subscribeTopic(topic).subscribe((event) => {
      const parsedEvent = JSON.parse(event.jsonString);
      const body = {};
      body[topic.slice(20)] = parsedEvent;
      this.events[position].unshift({name: topic.slice(20), body, id: parsedEvent.id, highlighted: false});
    }));
  }

  private resetTopics() {
    this.unsubscribeTopics();
    this.events = [[], [], []];
    this.eventSubscribed = [false, false, true];
  }
  mouseoverEvent(id: number) {
    this.resetHighlights();
    this.highlightEvents(id);
  }

  private highlightEvents(id: number) {
    this.events.forEach(eventPosition => {
      eventPosition.forEach(event => {
        if (id === event.id && !event.highlighted) {
          event.highlighted = true;
          const sources = event.body[event.name].sources;
          if (sources) {
            sources.forEach(source => {
              this.highlightEvents(source.id);
            });
          }
        }
      });
    });
  }

  resetHighlights() {
    this.events.forEach(eventPosition => {
      eventPosition.forEach(event => {
        event.highlighted = false;
      });
    });
  }

  private unsubscribeTopics() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
