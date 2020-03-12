import { TestBed } from '@angular/core/testing';

import { BlocklyService } from './blockly.service';

describe('BlocklyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlocklyService = TestBed.get(BlocklyService);
    expect(service).toBeTruthy();
  });
});
