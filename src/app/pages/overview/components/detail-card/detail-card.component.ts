import { EventStreamService } from '../../../../services/event-stream.service';
import { Statement } from '../../../../models/statemet';
import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements OnChanges {
  @Output() alerted = new EventEmitter<number>();
  @Output() statementUnselect: EventEmitter<void> = new EventEmitter<void>();

  @Input() statement: Statement;

  chartOption: EChartOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }]
  }

  constructor(private eventStreamService: EventStreamService) { }

  ngOnChanges() {
    if (this.statement) {
      this.eventStreamService.subscribeTopic(this.statement.eplParsed.name).subscribe(event => {
        if (!this.statement.alertCount) {
          this.statement.alertCount = 0;
        }
        this.statement.alertCount++;
        this.alerted.emit(this.statement.alertCount);
      });
    }
  }

  onStatementUnselect(): void {
    this.statementUnselect.emit();
  }

  onChartInit(ec) {
    console.log(ec);
  }

}
