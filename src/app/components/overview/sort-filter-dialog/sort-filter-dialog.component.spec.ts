import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortFilterDialogComponent } from './sort-filter-dialog.component';

describe('SortFilterDialogComponent', () => {
  let component: SortFilterDialogComponent;
  let fixture: ComponentFixture<SortFilterDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortFilterDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
