import { EventStreamService } from '../../../../services/event-stream.service';
import { Statement } from '../../../../models/statemet';
import { Component, OnChanges, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements AfterViewInit, OnChanges {
  @Output() alerted = new EventEmitter<number>();
  @Output() statementUnselect: EventEmitter<void> = new EventEmitter<void>();

  @Input() statement: Statement;

  chartOption: any;
  echartsInstance: any;

  constructor(
    private eventStreamService: EventStreamService,
    private theme: NbThemeService) { }

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

  ngAfterViewInit() {
    this.theme.getJsTheme().subscribe( (config: any) => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.setEChartsOption(colors, echarts);
    });
  }

  setEChartsOption( colors: any, echarts: any) {
    this.chartOption = {
      backgroundColor: echarts.bg,
      color: [colors.primary],
      title: {
        text: 'Number of hits',
        left: 'center'
    },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 1,
          end: 100,
          handleSize: '120%',
          dataBackground: {
            lineStyle: {
              color: colors.primary,
              width: 5
            },
            areaStyle: {
              color: colors.info
            },
          },
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 1,
          end: 100
        },
      ],
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
      }]
    };
  }

  onStatementUnselect(): void {
    this.statementUnselect.emit();
  }

  onChartInit(ec) {
    this.echartsInstance = ec;
  }

}
