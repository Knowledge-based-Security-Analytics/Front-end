import { EventStreamService } from '../../../../services/event-stream.service';
import { Statement } from '../../../../models/statemet';
import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements OnChanges {
  @Output() alerted = new EventEmitter<number>();

  @Input() statement: Statement;

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

}
