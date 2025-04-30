import { Injectable } from '@angular/core';
import * as StompJS from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public stompClient: StompJS.Client | null = null;
  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {
    this.setupStompJS();
  }

  setupStompJS() {
    try {
      this.stompClient = new StompJS.Client({
        // 'ws://35.175.111.200:8080/gs-guide-websocket'
        brokerURL: 'ws://localhost:8080/gs-guide-websocket', // TO REPLACE WITH AWS
      });

      this.stompClient?.activate();

      if (this.stompClient) {
        this.stompClient.onConnect = (frame) => {
          console.log('Connected to frame properly: ', frame);
          this.isConnected.next(true);
        };
      }
    } catch (exception) {
      console.log(exception);
    }
  }
}
