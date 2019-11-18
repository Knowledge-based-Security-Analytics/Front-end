import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventStreamService {

  constructor(private apollo: Apollo) {}

  public subscribeTopic(topic: string): Observable<any> {
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
        data => {subscriber.next((data as any).data.subscribeKafkaTopic); },
        error => {subscriber.error(error); },
        () => {subscriber.complete(); }
      );
    });
  }
}
