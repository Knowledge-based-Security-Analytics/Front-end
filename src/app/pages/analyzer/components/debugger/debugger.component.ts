import { ActivatedRoute } from '@angular/router';
import { StatementService } from 'src/app/services/statement.service';
import { EventStreamService } from '../../../../services/event-stream.service';
import { Component, OnInit } from '@angular/core';
import { Statement } from 'src/app/models/statemet';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.scss']
})
export class DebuggerComponent implements OnInit {

  private statement: Statement;
  public events: {name: string, body: string}[][] = [[], [], []];

  constructor(
    private route: ActivatedRoute,
    private stmtService: StatementService,
    private eventStreamService: EventStreamService,
    private statementService: StatementService) {}

  ngOnInit() {
    this.statement = this.stmtService.getStatement(this.route.snapshot.paramMap.get('deploymentId'));
    console.log(this.statement);
    this.subscribeTopics();
  }

  private async subscribeTopics() {
    this.subscribeTopic(this.statement, 2);

    let statementIDs: string[] = this.statement.deploymentDependencies;
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < statementIDs.length; i++) {
      const statementToSubscribe = this.statementService.getStatement(statementIDs[i]);
      if (statementToSubscribe.deploymentDependencies && statementToSubscribe.deploymentDependencies.length > 0) {
        statementIDs = statementIDs.concat(statementToSubscribe.deploymentDependencies);
        this.subscribeTopic(statementToSubscribe, 1);
      } else {
        this.subscribeTopic(statementToSubscribe, 0);
      }
    }
  }

  private subscribeTopic(statement: Statement, position: number) {
    this.eventStreamService.subscribeTopic(statement.eplParsed.name).subscribe((event) => {
      this.events[position].unshift({name: statement.eplParsed.name, body: event.jsonString});
    });
  }

}
