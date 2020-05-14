import { THEME_VARIABLES } from './../../../../@theme/styles/variables';
import { Event } from 'src/app/shared/models/event';
import { Subscription } from 'rxjs';
import { Pattern, Schema } from 'src/app/shared/models/eplObjectRepresentation';
import { Component,
   OnChanges,
   Input,
   Output,
   EventEmitter,
   AfterViewInit,
   ElementRef,
   ViewChildren,
   QueryList} from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { EventStreamService } from 'src/app/shared/services/event-stream.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements AfterViewInit, OnChanges {
  @Output() statementUnselect: EventEmitter<void> = new EventEmitter<void>();
  @Input() statement: Pattern | Schema;
  @ViewChildren('d3Histogram') title: QueryList<ElementRef>;

  events = [];
  colorScheme: any;
  themeSubscription: any;
  topicSubscription: Subscription;

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
      this.topicSubscription = this.eventStreamService.subscribeTopic(this.statement.name).subscribe(event => {
        this.events.push({timestamp: event.timestamp, object: JSON.parse(event.jsonString)});
      });
    }
  }

  ngAfterViewInit() {
    this.title.changes.subscribe((domElements: QueryList<ElementRef>) => this.initD3(domElements.first));
  }

  onStatementUnselect(): void {
    this.topicSubscription.unsubscribe();
    this.statementUnselect.emit();
  }

  private async initD3(parentDiv: ElementRef) {
    // Dimensions, margins, etc.
    const dimensions = {width: 960, height: 500, xFocTitle: 33};
    const margin = {top: 20, right: 20, bottom: 90, left: 40};
    const marginCtx = {top: 430, right: 20, bottom: 0, left: 40};
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom - dimensions.xFocTitle;
    const heightCtx = dimensions.height - marginCtx.top - marginCtx.bottom - dimensions.xFocTitle;

    // Times for context and focus
    const timeToDisplay = {
      maxSeconds: 600,
      pixelsPerSecond: 10
    };
    const initialTime = new Date().getTime();
    let endTimeCtx = new Date(initialTime);
    let startTimeCtx = new Date(endTimeCtx.getTime() - timeToDisplay.maxSeconds * 1000);
    let endTimeFoc = new Date(initialTime);
    let startTimeFoc = new Date(endTimeCtx.getTime() - width / timeToDisplay.pixelsPerSecond * 1000);
    let interval = endTimeFoc.getTime() - startTimeFoc.getTime();
    let offset = startTimeFoc.getTime() - startTimeCtx.getTime();

    // d3 Selectionevent for current brushX-selection on context
    let currentFocusSelection = null;

    // timescales for focus and context x axes
    const scales = {
      xFoc: d3.scaleTime().domain([startTimeFoc, endTimeFoc]).range([0, width]),
      yFoc: d3.scalePoint().domain([this.statement.name]).range([height, 0]),
      xCtx: d3.scaleTime().domain([startTimeCtx, endTimeCtx]).range([0, width]),
      yCtx: d3.scaleLinear().domain([-1, 1]).range([heightCtx, 0])
    };

    // x axes for focus and context
    const axes = {
      xAxisFoc: d3.axisBottom(scales.xFoc),
      yAxisFoc: d3.axisLeft(scales.yFoc),
      xAxisCtx: d3.axisBottom(scales.xCtx),
      yAxisCtx: d3.axisLeft(scales.yCtx).ticks(1)
    };

    // variables for live functionality
    let data = [];
    let eventBins = [];
    const roundTo = 5000; // 5 seconds
    const barWidth = Math.ceil((roundTo / (scales.xCtx.domain()[1].getTime() - scales.xCtx.domain()[0].getTime())) * width);

    const svg = d3.select(parentDiv.nativeElement)
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const brush = d3.brushX()
      .extent([[0, 0], [width, heightCtx]])
      .on('brush end', () => {
        currentFocusSelection = d3.event.selection;

        startTimeFoc = scales.xCtx.invert(currentFocusSelection[0]);
        endTimeFoc = scales.xCtx.invert(currentFocusSelection[1]);
        interval = endTimeFoc.getTime() - startTimeFoc.getTime();
        offset = startTimeFoc.getTime() - startTimeCtx.getTime();

        if (interval === 0 ) {
          interval = 300 * 1000;
          offset = 0;
        }

        scales.xFoc.domain([startTimeFoc, endTimeFoc]);
        focusGroup.select('.axis--x').call(axes.xAxisFoc);
      });

    svg.append('defs')
      .append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', width)
        .attr('height', height);

    // init main chart
    const focusGroup = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    focusGroup.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(axes.xAxisFoc);

    svg.append('text')
      .attr('class', 'focx-axis-title')
      .attr('text-anchor', 'middle')
      .attr('x', width)
      .attr('y', height + margin.top + dimensions.xFocTitle)
      .text('Time selection');

    const focusYAxisGroup = focusGroup.append('g')
      .attr('class', 'axis axis--y')
      .call(axes.yAxisFoc);

    focusYAxisGroup.selectAll('text')
      .attr('transform', 'translate(-10, 10)rotate(90)')
      .style('text-anchor', 'middle');

    // init small nav chart covering the maximum timeline
    const contextGroup = svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${marginCtx.left}, ${marginCtx.top})`);

    const contextBarChartGroup = contextGroup.append('g')
      .attr('class', 'context-chart')
      .attr('width', width)
      .attr('height', heightCtx)
      .attr('clip-path', 'url(#clip)');

    contextGroup.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${heightCtx})`)
      .call(axes.xAxisCtx);

    svg.append('text')
      .attr('class', 'ctxx-axis-title')
      .attr('text-anchor', 'middle')
      .attr('x', width)
      .attr('y', heightCtx + marginCtx.top + dimensions.xFocTitle)
      .text('Last 10 min');

    contextGroup.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, [scales.xCtx(startTimeFoc), scales.xCtx(endTimeFoc)])
      .selectAll('.selection')
        .attr('fill', THEME_VARIABLES.basic[600])
        .attr('stroke', THEME_VARIABLES.basic[600]);

    const tooltip = d3.select(parentDiv.nativeElement).append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');

    // hover functions for the event drops on the focus group
    const onMouseOverFocusDrop = (d: any) => {
      tooltip
        .style('opacity', 1);
      focusGroup.selectAll('.focus-drop')
        .transition().duration(100)
        .attr('r', (e: any) => (d.object.id === e.object.id) ? 14 : 7);
    };
    const onMouseMoveFocusDrop = function(d: any) {
      tooltip.html(`Event ID: ${d.object.id}`)
        .style('left', d3.select(this).attr('cx') + 70 + 'px')
        .style('top', d3.select(this).attr('cy') + 'px');
    };
    const onMouseOutFocusDrop = () => {
      tooltip.style('opacity', 0);
      focusGroup.selectAll('.focus-drop')
      .transition().duration(100)
      .attr('r', 7);
    };

    const tick = () => {
      data = this.events.filter((event: Event) =>
        event.timestamp.getTime() > startTimeCtx.getTime() && event.timestamp.getTime() < endTimeCtx.getTime()
      );

      const eventsRoundedToTiming = {};
      let maxCount = 0;
      eventBins = [];
      data.map((event: Event) => {
        const rounded = Math.floor(event.timestamp.getTime() / roundTo) * roundTo;
        eventsRoundedToTiming[rounded] = eventsRoundedToTiming[rounded] + 1 || 1;
      });
      for (const k in eventsRoundedToTiming) {
        if (k) {
          const tempDate = new Date();
          tempDate.setTime(+k);
          if (eventsRoundedToTiming[k] > maxCount) { maxCount = eventsRoundedToTiming[k]; }
          eventBins.push({date: tempDate, count: eventsRoundedToTiming[k]});
        }
      }

      scales.yCtx.domain([0, maxCount]);

      const focusUpdateSel = focusGroup.selectAll('.focus-drop')
        .data(data);

      focusUpdateSel.exit().remove();

      focusUpdateSel.enter().append('circle')
        .attr('id', (d: any) => d.object.id)
        .attr('class', 'focus-drop')
        .attr('r', 7)
        .attr('fill', THEME_VARIABLES.danger[600])
        .attr('cx', (d: any) => scales.xFoc(d.timestamp))
        .attr('cy', (d: any) => scales.yFoc(this.statement.name))
        .on('mouseover', onMouseOverFocusDrop)
        .on('mousemove', onMouseMoveFocusDrop)
        .on('mouseout', onMouseOutFocusDrop);

      focusUpdateSel
        .attr('cx', (d: any) => scales.xFoc(d.timestamp))
        .attr('cy', height / 2);

      const contextUpdateSel = contextBarChartGroup.selectAll('.context-bar')
        .data(eventBins);

      contextUpdateSel.exit().remove();

      contextUpdateSel.enter().insert('rect')
        .attr('class', 'context-bar')
        .attr('width', barWidth)
        .attr('fill', THEME_VARIABLES.primary[300])
        .attr('stroke', THEME_VARIABLES.basic[100]);

      contextUpdateSel
        .attr('x', (d: any) => scales.xCtx(d.date))
        .attr('y', (d: any) => scales.yCtx(d.count))
        .attr('height', (d: any) => heightCtx - scales.yCtx(d.count));
    };

    tick();

    // live updating the chart
    setInterval(() => {
      startTimeFoc = scales.xCtx.invert(currentFocusSelection[0]);
      endTimeFoc = scales.xCtx.invert(currentFocusSelection[1]);

      endTimeCtx = new Date();
      startTimeCtx = new Date(endTimeCtx.getTime() - timeToDisplay.maxSeconds * 1000);

      scales.xFoc.domain([startTimeFoc, endTimeFoc]);
      scales.xCtx.domain([startTimeCtx, endTimeCtx]);

      focusGroup.select('.axis--x').call(axes.xAxisFoc);
      contextGroup.select('.axis--x').call(axes.xAxisCtx);

      tick();
    }, 50);

    window.addEventListener('resize', () => {
      console.log(parseInt(d3.select(parentDiv.nativeElement).style('width'), 10));
    })
  }
}
