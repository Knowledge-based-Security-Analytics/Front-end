import { Component, OnInit } from '@angular/core';
import { Statement } from 'src/app/models/statemet';
import { StatementService } from 'src/app/services/statement.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  public statements: Statement[];

  constructor(private statementService: StatementService) { }

  ngOnInit() {
    this.statementService.getStatements({name: true, eplStatement: true, deploymentId: true}).then(statements => {
      this.statements = statements;
    });

    setInterval(() => {
      const i = Math.floor(Math.random() * Math.floor(this.statements.length));
      if (!this.statements[i].alertCount) {
        this.statements[i].alertCount = 0;
      }
      const c = Math.floor(Math.random() * Math.floor(100));
      this.statements[i].alertCount += c;
    }, 1000);
  }

  private dropStatement(i: number) {
    console.log(i);
    this.statementService.dropStatement(this.statements[i].deploymentId).then(result => {
      if (result) {
        this.statements.splice(i, 1);
      }
    });
  }
}
