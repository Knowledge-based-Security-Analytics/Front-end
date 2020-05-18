import { Pattern, Schema } from 'src/app/shared/models/eplObjectRepresentation';
import { Component,
   Input,
   Output,
   EventEmitter} from '@angular/core';


@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent {
  @Output() statementUnselect: EventEmitter<void> = new EventEmitter<void>();
  @Input() statement: Pattern | Schema;

  constructor() { }

  onStatementUnselect(): void {
    this.statementUnselect.emit();
  }
}
