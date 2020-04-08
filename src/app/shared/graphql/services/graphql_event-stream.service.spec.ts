import { TestBed } from '@angular/core/testing';
import { GraphQLEventStreamService } from './graphql_event-stream.service';

describe('EventStreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GraphQLEventStreamService = TestBed.get(GraphQLEventStreamService);
    expect(service).toBeTruthy();
  });
});
