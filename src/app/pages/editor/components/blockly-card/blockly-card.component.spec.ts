import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocklyCardComponent } from './blockly-card.component';

describe('BlocklyComponent', () => {
  let component: BlocklyCardComponent;
  let fixture: ComponentFixture<BlocklyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocklyCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocklyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
