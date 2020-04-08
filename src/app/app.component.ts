import { Router, RouterEvent } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  activeRoute = '/';

  items = [
    { title: 'Add schema', icon: 'layers-outline', link: '/editor/schema' },
    { title: 'Add pattern', icon: 'funnel-outline', link: '/editor/pattern' },
  ];

  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((routerEvent: RouterEvent) => {
      if (routerEvent.hasOwnProperty('url')) { this.activeRoute = routerEvent.url; }
    });
  }
}
