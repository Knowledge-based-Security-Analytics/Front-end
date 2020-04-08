import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from 'src/app/models/event';
import { GraphQLEventStreamService } from '../graphql/services/graphql_event-stream.service';

@Injectable({
  providedIn: 'root'
})
export class EventStreamService {
  private topics: string[];

  constructor(private graphQLEventStreamService: GraphQLEventStreamService) { }

  public subscribeTopic(topic: string): Observable<Event> {
    return this.graphQLEventStreamService.subscribeTopic(topic);
  }

  public async getTopics(): Promise<string[]> {
    return new Promise(async resolve => {
      if (!this.topics) {
        this.topics = await this.graphQLEventStreamService.getTopics();
      }
      resolve(this.topics);
    });
  }

  public async pushTopic(name: string): Promise<boolean> {
    return this.graphQLEventStreamService.pushTopic(name).then(success => {
      if (success) {
        this.topics.push(name);
      }
      return success;
    });
  }

  public async dropTopic(name: string): Promise<boolean> {
    return this.graphQLEventStreamService.dropTopic(name)
    .then(success => {
      if (success) {
        const i = this.topics.findIndex(topic => topic === name);
        this.topics.splice(i, 1);
      }
      return success;
    });
  }
}
