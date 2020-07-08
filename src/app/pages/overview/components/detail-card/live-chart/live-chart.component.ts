import { StatementService } from './../../../../../shared/services/statement.service';
import { IEventAlias } from './../../../../../shared/models/eplObjectRepresentation';
import { Component, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { Pattern, Schema, Statement } from 'src/app/shared/models/eplObjectRepresentation';
import { EventStreamService } from 'src/app/shared/services/event-stream.service';
import { NbThemeService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { THEME_VARIABLES } from 'src/app/@theme/styles/variables';
import { Event } from 'src/app/shared/models/event';
import * as d3 from 'd3';

@Component({
  selector: 'app-live-chart',
  templateUrl: './live-chart.component.html',
  styleUrls: ['./live-chart.component.css']
})
export class LiveChartComponent implements OnChanges, AfterViewInit {
  @Input() statement: Pattern | Schema;

  // Kafka-connection variables
  private kafkaEvents = [];
  private kafkaTopicSubscriptions: Subscription[] = [];
  private topics = [];
  private yAxisCategories = [];

  // Dimensions, margins, etc.
  private currentWidth = 0;
  private dimensions = {height: 400, xFocTitle: 33};
  private margin = {top: 20, right: 20, bottom: 90, left: 40};
  private marginCtx = {top: 330, right: 20, bottom: 0, left: 40};
  private width = 0;
  private height = this.dimensions.height - this.margin.top - this.margin.bottom - this.dimensions.xFocTitle;
  private heightCtx = this.dimensions.height - this.marginCtx.top - this.marginCtx.bottom - this.dimensions.xFocTitle;

  // Times for context and focus
  private timeToDisplay = {maxSeconds: 600, pixelsPerSecond: 10};
  private initialTime: number = new Date().getTime();
  private endTimeCtx: Date = new Date(this.initialTime);
  private startTimeCtx: Date = new Date(this.endTimeCtx.getTime() - this.timeToDisplay.maxSeconds * 1000);
  private endTimeFoc: Date = new Date(this.initialTime);
  private startTimeFoc: Date = new Date(this.initialTime);
  private interval: number = this.endTimeFoc.getTime() - this.startTimeFoc.getTime();
  private offset: number = this.startTimeFoc.getTime() - this.startTimeCtx.getTime();

  // d3 Selectionevent for current brushX-selection on context
  private currentFocusSelection = null;

  // timescales for focus and context x axes
  private scales = {
    xFoc: d3.scaleTime(),
    yFoc: d3.scalePoint(),
    xCtx: d3.scaleTime(),
    yCtx: d3.scaleLinear().domain([-1, 1]).range([this.heightCtx, 0]),
    color: d3.scaleOrdinal()
  };

  // variables for live functionality
  public liveViewToggled = true;
  private data = []; // data displayed in the live chart
  private eventBins = []; // bins for context bar chart
  private roundTo = 5000; // 5 seconds, equivalent to the size of the bins for context bar chart
  private barWidth = 10;
  private brushBehavior = null;

  private domElementGroups = {
    svg: null,
    context: null,
    contextBarChart: null,
    xAxisContext: null,
    xAxisContextTitle: null,
    yAxisContext: null,
    focus: null,
    focusChart: null,
    xAxisFocus: null,
    xAxisFocusTitle: null,
    yAxisFocus: null,
    tooltip: null,
    brush: null,
  };

  constructor(
    private eventStreamService: EventStreamService,
    private statementService: StatementService,
    private theme: NbThemeService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.statement.firstChange) {
      this.subscribeTopics();
    } else {
      if (changes.statement.currentValue.id !== changes.statement.previousValue.id) {
        this.subscribeTopics();
        this.drawChart();
       }
    }
  }

  private subscribeTopics(): void {
    this.kafkaTopicSubscriptions.map((subscription: Subscription) => subscription.unsubscribe());
    this.kafkaEvents = [];
    this.yAxisCategories = this.topics = [this.statement.name];
    this.subscribeTopic((this.getOutputTopic(this.statement)));
    if (!Statement.isSchema(this.statement)) {
      this.statement.deploymentProperties.dependencies.map((deploymentId: string) => {
        this.subscribeTopic(this.statementService.getStatement(deploymentId).outputName);
        this.topics.push(this.statementService.getStatement(deploymentId));
      });
      this.yAxisCategories = ['1', 'Sources', this.statement.name, ''];
    }
  }

  private getOutputTopic(statement: Statement): string {
    let topic: string = statement.outputName;
    if (statement.deploymentProperties.eplStatement.includes('@KafkaOutput')) {
      topic = statement.deploymentProperties.eplStatement.match(/@KafkaOutput\('.*?'\)/)[0];
      topic = topic
        .slice(14, -2);
    }
    return topic;
  }

  private subscribeTopic(topicName: string): void {
    this.kafkaTopicSubscriptions.push(this.eventStreamService.subscribeTopic(topicName).subscribe(event => {
      this.kafkaEvents.push({timestamp: event.timestamp, object: JSON.parse(event.jsonString), topic: event.topic});
    }));
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => {
      this.initVariables(d3.selectAll('#d3Histogram'));
      this.drawChart();
    });
    this.initD3(d3.selectAll('#d3Histogram'));
  }

  private async initD3(parentDiv: any) {
    this.initVariables(parentDiv);

    this.domElementGroups.svg = parentDiv
      .append('svg')
      .attr('height', this.dimensions.height);

    this.brushBehavior = d3.brushX()
      .extent([[0, 0], [this.width, this.heightCtx]])
      .on('brush end', () => {
        this.currentFocusSelection = d3.event.selection;

        this.startTimeFoc = this.scales.xCtx.invert(this.currentFocusSelection[0]);
        this.endTimeFoc = this.scales.xCtx.invert(this.currentFocusSelection[1]);
        this.interval = this.endTimeFoc.getTime() - this.startTimeFoc.getTime();
        this.offset = this.startTimeFoc.getTime() - this.startTimeCtx.getTime();

        if (this.interval === 0 ) {
          this.interval = 300 * 1000;
          this.offset = 0;
        }

        this.scales.xFoc.domain([this.startTimeFoc, this.endTimeFoc]);
        this.domElementGroups.xAxisFocus.call(d3.axisBottom(this.scales.xFoc));
      });

    this.domElementGroups.svg.append('defs')
      .append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', this.width)
        .attr('height', this.height);

    // init main chart
    this.domElementGroups.focus = this.domElementGroups.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.domElementGroups.focusChart = this.domElementGroups.focus.append('g')
      .attr('height', this.height);

    this.domElementGroups.xAxisFocus = this.domElementGroups.focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`);

    this.domElementGroups.xAxisFocusTitle = this.domElementGroups.svg.append('text')
      .attr('class', 'focx-axis-title')
      .attr('text-anchor', 'middle')
      .attr('y', this.height + this.margin.top + this.dimensions.xFocTitle)
      .text('Time selection');

    this.domElementGroups.yAxisFocus = this.domElementGroups.focus.append('g')
      .attr('class', 'axis axis--y');

    // init small nav chart covering the maximum timeline
    this.domElementGroups.context = this.domElementGroups.svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${this.marginCtx.left}, ${this.marginCtx.top})`);

    this.domElementGroups.contextBarChart = this.domElementGroups.context.append('g')
      .attr('class', 'context-chart')
      .attr('height', this.heightCtx)
      .attr('clip-path', 'url(#clip)');

    this.domElementGroups.xAxisContext = this.domElementGroups.context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.heightCtx})`);

    this.domElementGroups.xAxisContextTitle = this.domElementGroups.svg.append('text')
      .attr('class', 'ctxx-axis-title')
      .attr('text-anchor', 'middle')
      .attr('y', this.heightCtx + this.marginCtx.top + this.dimensions.xFocTitle)
      .text('Last 10 min');

    this.domElementGroups.tooltip = parentDiv.append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');

    this.domElementGroups.brush = this.domElementGroups.context.append('g')
      .attr('class', 'brush');

    this.drawChart();
    this.tick();

    // live updating the chart
    setInterval(() => this.moveInterval(), 50);
  }

  private initVariables(parentDiv: any): void {
    this.currentWidth = parseInt(parentDiv.style('width'), 10);
    this.width = this.currentWidth - this.margin.left - this.margin.right;

    this.startTimeFoc = new Date(this.endTimeCtx.getTime() - this.width / this.timeToDisplay.pixelsPerSecond * 1000);

    this.scales.xFoc = d3.scaleTime().domain([this.startTimeFoc, this.endTimeFoc]).range([0, this.width]);
    this.scales.xCtx = d3.scaleTime().domain([this.startTimeCtx, this.endTimeCtx]).range([0, this.width]);
    // tslint:disable-next-line: max-line-length
    this.barWidth = Math.ceil((this.roundTo / (this.scales.xCtx.domain()[1].getTime() - this.scales.xCtx.domain()[0].getTime())) * this.width);
  }

  private drawChart(): void {
    this.domElementGroups.svg.attr('width', this.currentWidth);
    this.brushBehavior.extent([[0, 0], [this.width, this.heightCtx]]);

    this.scales.yFoc =  d3.scalePoint()
      .domain(this.yAxisCategories)
      .range([this.height, 0]);

    this.scales.color = d3.scaleOrdinal()
      .domain(this.topics)
      .range(d3.schemeSet2);

    this.domElementGroups.xAxisFocusTitle.attr('x', this.width);
    this.domElementGroups.xAxisContextTitle.attr('x', this.width);
    this.domElementGroups.contextBarChart.attr('width', this.width);

    this.domElementGroups.xAxisFocus.call(d3.axisBottom(this.scales.xFoc));
    if (this.yAxisCategories.length > 1) {
      this.domElementGroups.yAxisFocus.call(d3.axisLeft(this.scales.yFoc).tickValues(['Sources', this.statement.name]));
    } else {
      this.domElementGroups.yAxisFocus.call(d3.axisLeft(this.scales.yFoc));
    }
    this.domElementGroups.xAxisContext.call(d3.axisBottom(this.scales.xCtx).tickSize(-this.height * 1.3));

    this.domElementGroups.yAxisFocus.selectAll('text')
      .attr('transform', 'translate(-10, 10)rotate(90)')
      .style('text-anchor', 'middle');

    this.domElementGroups.yAxisFocus.selectAll('.domain')
      .remove();

    this.domElementGroups.brush
      .call(this.brushBehavior)
      .call(this.brushBehavior.move, [this.scales.xCtx(this.startTimeFoc), this.scales.xCtx(this.endTimeFoc)])
      .selectAll('.selection')
        .attr('fill', THEME_VARIABLES.basic[600])
        .attr('stroke', THEME_VARIABLES.basic[600]);
  }

  private tick(): void {
    // hover functions for the event drops on the focus group
    const onMouseOverFocusDrop = (d: any) => {
      d3.selectAll('.tooltip')
        .style('opacity', 1);
      this.domElementGroups.focusChart.selectAll('.focus-drop')
        .transition().duration(100)
        .attr('r', (e: any) => (d.object.id === e.object.id) ? 14 : 7);
    };
    const onMouseMoveFocusDrop = function(d: any) {
      d3.selectAll('.tooltip').html(`Event ID: ${d.object.id}`)
        .style('left', d3.select(this).attr('cx') + 70 + 'px')
        .style('top', d3.select(this).attr('cy') + 'px');
    };
    const onMouseOutFocusDrop = () => {
      d3.selectAll('.tooltip').style('opacity', 0);
      this.domElementGroups.focusChart.selectAll('.focus-drop')
        .transition().duration(100)
        .attr('r', 7);
    };
    this.data = this.kafkaEvents.filter((event: Event) =>
      event.timestamp.getTime() > this.startTimeCtx.getTime() && event.timestamp.getTime() < this.endTimeCtx.getTime()
    );

    const eventsRoundedToTiming = {};
    let maxCount = 0;
    this.eventBins = [];
    this.data.map((event: Event) => {
      const rounded = Math.floor(event.timestamp.getTime() / this.roundTo) * this.roundTo;
      eventsRoundedToTiming[rounded] = eventsRoundedToTiming[rounded] + 1 || 1;
    });
    for (const k in eventsRoundedToTiming) {
      if (k) {
        const tempDate = new Date();
        tempDate.setTime(+k);
        if (eventsRoundedToTiming[k] > maxCount) { maxCount = eventsRoundedToTiming[k]; }
        this.eventBins.push({date: tempDate, count: eventsRoundedToTiming[k]});
      }
    }

    this.scales.yCtx.domain([0, maxCount]);

    const focusUpdateSel = this.domElementGroups.focusChart.selectAll('.focus-drop')
      .data(this.data);

    focusUpdateSel.exit().remove();

    focusUpdateSel.enter().append('circle')
      .attr('id', (d: any) => d.object.id)
      .attr('class', 'focus-drop')
      .attr('r', 7)
      .attr('fill', (d: any) => this.scales.color(d.topic))
      .attr('cx', (d: any) => this.scales.xFoc(d.timestamp))
      .attr('cy', (d: any) =>
        d.topic === this.getOutputTopic(this.statement) ? this.scales.yFoc(this.statement.name) : this.scales.yFoc('Sources'))
      .on('mouseover', onMouseOverFocusDrop)
      .on('mousemove', onMouseMoveFocusDrop)
      .on('mouseout', onMouseOutFocusDrop);

    focusUpdateSel
      .attr('cx', (d: any) => this.scales.xFoc(d.timestamp))
      .attr('display', (d: any) => this.scales.xFoc(d.timestamp) > 0 ? 'block' : 'none');

    const contextUpdateSel = this.domElementGroups.contextBarChart.selectAll('.context-bar')
      .data(this.eventBins);

    contextUpdateSel.exit().remove();

    contextUpdateSel.enter().insert('rect')
      .attr('class', 'context-bar')
      .attr('width', this.barWidth)
      .attr('fill', THEME_VARIABLES.primary[300])
      .attr('stroke', THEME_VARIABLES.basic[100]);

    contextUpdateSel
      .attr('x', (d: any) => this.scales.xCtx(d.date))
      .attr('y', (d: any) => this.scales.yCtx(d.count))
      .attr('height', (d: any) => this.heightCtx - this.scales.yCtx(d.count));
  }

  private moveInterval(): void {

    this.startTimeFoc = this.scales.xCtx.invert(this.currentFocusSelection[0]);
    this.endTimeFoc = this.scales.xCtx.invert(this.currentFocusSelection[1]);

    if (this.liveViewToggled) {
      this.endTimeCtx = new Date();
      this.startTimeCtx = new Date(this.endTimeCtx.getTime() - this.timeToDisplay.maxSeconds * 1000);
      this.scales.xCtx.domain([this.startTimeCtx, this.endTimeCtx]);
    }

    this.scales.xFoc.domain([this.startTimeFoc, this.endTimeFoc]);

    this.domElementGroups.xAxisFocus.call(d3.axisBottom(this.scales.xFoc));
    this.domElementGroups.xAxisContext.call(d3.axisBottom(this.scales.xCtx));

    this.tick();
  }
}
