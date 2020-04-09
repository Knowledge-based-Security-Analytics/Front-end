import { Pattern, Schema } from 'src/app/models/statement';
import { Component, OnChanges, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EventStreamService } from 'src/app/shared/services/event-stream.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements AfterViewInit, OnChanges {
  @Output() alerted = new EventEmitter<number>();
  @Output() statementUnselect: EventEmitter<void> = new EventEmitter<void>();

  @Input() statement: Pattern | Schema;
  @ViewChild('d3Histogram') d3HistogramRef: ElementRef;

  colorScheme: any;
  themeSubscription: any;

  constructor(
    private eventStreamService: EventStreamService,
    private theme: NbThemeService) { }

  ngOnChanges() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };
    });
    if (this.statement) {
      this.eventStreamService.subscribeTopic(this.statement.name).subscribe(event => {
        if (!this.statement.alertCount) {
          this.statement.alertCount = 0;
        }
        this.statement.alertCount++;
        console.log(event.jsonString);
        this.alerted.emit(this.statement.alertCount);
      });
    }
    this.initD3();
  }

  ngAfterViewInit() {

  }

  onStatementUnselect(): void {
    this.statementUnselect.emit();
  }

  initD3() {
    const svg = d3.create('svg');
  }
}
