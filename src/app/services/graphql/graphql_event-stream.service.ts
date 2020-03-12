import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { GraphQLUtils } from './graphql_utils';
import { Event } from '../../models/event';

@Injectable({
  providedIn: 'root'
})
export class GraphQLEventStreamService {

  constructor(private apollo: Apollo) {}

  public subscribeTopic(topic: string): Observable<Event> {
    return new Observable(subscriber => {
      this.apollo.subscribe({
        query: gql`
          subscription {
            subscribeKafkaTopic(topic: "${topic}") {
              jsonString
              timestamp
            }
          }`
      }).subscribe(
        data => {
          subscriber.next({jsonString: (data as any).data.subscribeKafkaTopic.jsonString,
                           timestamp: new Date((data as any).data.subscribeKafkaTopic.timestamp)});
        },
        error => {subscriber.error(error); },
        () => {subscriber.complete(); }
      );
    });
  }

  public async getTopics(): Promise<string[]> {
    return new Promise(resolve => {
      this.apollo.query({
        query: gql`
            {
              topics
            }
          `
      }).subscribe(result => {
        resolve((result.data as any).topics);
      });
    });
  }

  public async pushTopic(name: string): Promise<boolean> {
    const gqlString = gql`
    mutation {
      createTopic(
          topic: "${name}"
      )
    }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).createTopic;
  }

  public async dropTopic(name: string): Promise<boolean> {
    const gqlString = gql`
    mutation {
      deleteTopic(
          topic: "${name}"
      )
    }`;
    return (await GraphQLUtils.mutate(gqlString, this.apollo)).deleteTopic;
  }
}
