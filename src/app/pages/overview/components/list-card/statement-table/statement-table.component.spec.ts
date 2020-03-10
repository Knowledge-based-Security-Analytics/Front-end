import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementTableComponent } from './statement-table.component';

describe('StatementTableComponent', () => {
  let component: StatementTableComponent;
  let fixture: ComponentFixture<StatementTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
