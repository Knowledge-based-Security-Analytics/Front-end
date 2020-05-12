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
        console.log(event);
        this.events.push(event);
      });
    }
  }

  ngAfterViewInit() {
    this.title.changes.subscribe((domElements: QueryList<ElementRef>) => this.initTest(domElements.first));
  }

  onStatementUnselect(): void {
    this.topicSubscription.unsubscribe();
    this.statementUnselect.emit();
  }

  async initD3(parentDiv: ElementRef) {

    const margins = {
      top: 20,
      right: 30,
      bottom: 30,
      left: 30,
      topNav: 10,
      bottomNav: 20
    };
    const dimensions = {
      svgWidth: 1000,
      svgHeight: 500,
      width: 1200,
      height: 500,
      widthNav: 0,
      heightNav: 0,
      chartTitle: 0,
      xAxis: 20,
      yAxis: 20,
      xTitle: 20,
      yTitle: 20,
      navChart: 70,
      marginTop: 0,
      marginTopNav: 0
    };
    const titles = {
      chartTitle: 'Chart title',
      yTitle: '',
      xTitle: 'Time',
    };
    const domElements = {
      svg: null,
      mainG: null,
      nav: null,
      navG: null,
      xAxisG: null,
      yAxisG: null,
      barG: null
    };
    const config = {
      maxSeconds: 300,
      pixelsPerSecond: 5,
      maxY: 100,
      minY: 0,
      drawXAxis: true,
      drawYAxis: true,
      drawNavChart: true,
      border: null,
      selection: null,
      barId: 0,
      yDomain: [],
      debug: false,
      barWidth: 5,
      halt: false,
      x: null,
      y: null,
      xNav: null,
      yNav: null,
      xAxis: null,
      yAxis: null,
      xAxisNav: null,
    };

    // compute dimension of main and nav charts as well as offsets
    dimensions.marginTop = margins.top + dimensions.chartTitle;
    dimensions.height = dimensions.svgHeight - dimensions.marginTop - dimensions.chartTitle - dimensions.xTitle - dimensions.xAxis - dimensions.navChart;
    dimensions.heightNav = dimensions.navChart - margins.topNav - margins.bottomNav;
    dimensions.marginTopNav = dimensions.svgHeight - margins.bottom - dimensions.heightNav - margins.topNav;
    dimensions.width = dimensions.svgWidth - margins.left - margins.right;
    dimensions.widthNav = dimensions.width;

    // append the svg
    domElements.svg = d3.select(parentDiv.nativeElement)
      .append('svg')
        .attr('width', dimensions.svgWidth)
        .attr('height', dimensions.svgHeight)
        // .style('border', () => '1px solid lightgray');

    // create main group and translate
    domElements.mainG = domElements.svg.append('g')
      .attr('transform', `translate(${margins.left}, ${dimensions.marginTop})`);

    // define clip-path
    domElements.mainG.append('defs').append('clipPath')
      .attr('id', 'myClip')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    // create chart background
    domElements.mainG.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .style('fill', '#f5f5f5');

    domElements.barG = domElements.mainG.append('g')
      .attr('class', 'barGroup')
      .attr('transform', 'translate(0, 0)')
      .attr('clip-path', 'url(#myClip')
      .append('g');

    domElements.xAxisG = domElements.mainG.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${dimensions.height})`);

    domElements.xAxisG.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', 25)
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .style('font', '12px sans-serif')
      .text(titles.xTitle);

/*     domElements.mainG.append('text')
      .attr('x', dimensions.width / 2)
      .attr('y', -20)
      .attr('dy', '.71em')
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text(titles.chartTitle); */

    config.x = d3.scaleTime().range([0, dimensions.width]);
    config.xAxis = d3.axisBottom(config.x);

   /*  domElements.nav = domElements.svg.append('g')
      .attr('transform', `translate (${margins.left}, ${dimensions.marginTopNav + 50})`);

    domElements.nav.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', dimensions.width)
      .attr('height', dimensions.heightNav)
      .style('fill', '#F5F5F5')
      .attr('transfrom', 'translate(0, 0)');

    domElements.navG = domElements.nav.append('g')
      .attr('class', 'nav');

    const xAxisGNav = domElements.nav.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${dimensions.heightNav})`);

    config.xNav = d3.scaleTime().range([0, dimensions.widthNav]);
    config.xAxisNav = d3.axisBottom(config.xNav);
 */
    const ts = new Date().getTime();

    let endTime = new Date(ts);
    let startTime = new Date(endTime.getTime() - dimensions.width / config.pixelsPerSecond * 1000);

    config.x.domain([startTime, endTime]);
    // config.xNav.domain([startTime, endTime]);
    config.xAxis.scale(config.x)(domElements.xAxisG);
    // config.xAxisNav.scale(config.xNav)(xAxisGNav);

/*     setInterval(() => {
      endTime = new Date();
      startTime = new Date(endTime.getTime() - dimensions.width / config.pixelsPerSecond * 1000);

      config.x.domain([startTime, endTime]);
      config.xNav.domain([startTime, endTime]);

      config.xAxis.scale(config.x)(domElements.xAxisG);
      config.xAxisNav.scale(config.xNav)(xAxisGNav);
    }, 100); */
  }

  private async initTest(parentDiv: ElementRef) {
    const initialTime = new Date().getTime();
    const dimensions = {width: 960, height: 500}
    const margin = {top: 20, right: 20, bottom: 110, left: 40};
    const margin2 = {top: 430, right: 20, bottom: 30, left: 40};
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    const height2 = dimensions.height - margin2.top - margin2.bottom;

    const svg = d3.select(parentDiv.nativeElement)
      .append('svg')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    let endTime2 = new Date(initialTime);
    let startTime2 = new Date(endTime2.getTime() - 300 * 1000);
    const interval2 = endTime2.getTime() - startTime2.getTime();
    let currentSelection = null;

    let endTime = new Date(initialTime);
    let startTime = new Date(endTime2.getTime() - width / 10 * 1000);
    let interval = endTime.getTime() - startTime.getTime();
    let offset = startTime.getTime() - startTime2.getTime();

    const x = d3.scaleTime()
      .domain([startTime, endTime])
      .range([0, width]);
    const x2 = d3.scaleTime()
      .domain([startTime2, endTime2])
      .range([0, width]);

    const xAxis = d3.axisBottom(x);
    const xAxis2 = d3.axisBottom(x2);

    const brush = d3.brushX()
      .extent([[0, 0], [width, height2]])
      .on('brush end', () => {
        currentSelection = d3.event.selection;

        startTime = x2.invert(currentSelection[0]);
        endTime = x2.invert(currentSelection[1]);
        interval = endTime.getTime() - startTime.getTime();
        offset = startTime.getTime() - startTime2.getTime();

        if (interval === 0 ) {
          interval = 300 * 1000;
          offset = 0;
        }

        // TODO update displayed events
        x.domain([startTime, endTime]);
        focus.select('.axis--x').call(xAxis);
      });

    svg.append('defs')
      .append('clipPath')
        .attr('id', 'clip')
      .append('rect')
        .attr('width', width)
        .attr('height', height);

    const focus = svg.append('g')
      .attr('class', 'focus')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${margin2.left}, ${margin2.top})`);

    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${height2})`)
      .call(xAxis2);

    context.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, [x2(startTime), x2(endTime)]);

    setInterval(() => {
      startTime = x2.invert(currentSelection[0]);
      endTime = x2.invert(currentSelection[1]);

      endTime2 = new Date();
      startTime2 = new Date(endTime2.getTime() - 300 * 1000);

      x.domain([startTime, endTime]);
      x2.domain([startTime2, endTime2]);

      focus.select('.axis--x').call(xAxis);
      context.select('.axis--x').call(xAxis2);
    }, 100);
  }
}
