import { Component, OnInit } from '@angular/core';
import { Statement } from 'src/app/models/statemet';
import { StatementService } from 'src/app/services/statement.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  public statements: OverwiewStatement[];

  constructor(private statementService: StatementService) { }

  ngOnInit() {
    this.statementService.statementsObservable.subscribe(statements => {
      console.log(statements);
      this.statements = statements.map(statement => Object.assign({}, statement));
    });
    this.statementService.getStatements();

    setInterval(() => {
      const i = Math.floor(Math.random() * Math.floor(this.statements.length));
      if (this.statements.length === 0) {
        return;
      }
      if (!this.statements[i].alertCount) {
        this.statements[i].alertCount = 0;
      }
      const c = Math.floor(Math.random() * Math.floor(100));
      this.statements[i].alertCount += c;
    }, 1000);
  }

  public dropStatement(i: number) {
    this.statementService.dropStatement(this.statements[i].deploymentId);
  }

  public filterStatements(filter: {dev?: boolean}) {

  }
}

interface OverwiewStatement extends Statement {
  visible?: boolean;
}
