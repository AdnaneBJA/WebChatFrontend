import { Component, OnInit } from '@angular/core';
import * as StompJS from '@stomp/stompjs';
import { SocketService } from '../services/socketservices/socket.service';
import { Subscription } from 'rxjs';

interface Message {
  message: string;
  text: string;
  senderID: number;
  sender: string;
  time: string;
  isCurrentUser: boolean;
}

@Component({
  selector: 'app-general-chat',
  standalone: false,
  templateUrl: './general-chat.component.html',
  styleUrls: ['./general-chat.component.css'],
})
export class GeneralChatComponent implements OnInit {
  private isConnectedSubscription: Subscription | null = null;
  private isConnected: boolean = false;
  private userID: string | null = localStorage.getItem('userID');
  public messages: any = [];

  newMessage: string = '';

  constructor(public stompService: SocketService) {
    this.isConnectedSubscription = stompService.isConnected.subscribe(
      (connected) => {
        this.isConnected = connected;
        console.log('VALUE OF CONNECTED: ' + this.isConnected);
        console.log('JWT TOKEN:' + localStorage.getItem('jwtToken'));
        if (this.isConnected) {
          this.connect();
        }
      }
    );
  }

  ngOnInit(): void {}

  connect() {
    if (this.isConnected) {
      this.stompService.stompClient?.subscribe(`/topic/message`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        this.messages = [];
        for (let message of receivedMessage) {
          const isCurrentUser = message.senderID.toString() === this.userID;
          const pushedMessage: Message = {
            message: message.message,
            text: message.message,
            senderID: message.senderID,
            sender: message.username,
            time: message.time,
            isCurrentUser: isCurrentUser,
          };
          this.messages.push(pushedMessage);
          console.log('PUSHED ARRAY', this.messages);
        }

        console.log('Received message: ', receivedMessage);
      });
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    console.log('Sent message: ' + this.newMessage);
    const sentMessageToBackend = {
      message: this.newMessage,
      senderID: this.userID,
      time: new Date().toLocaleTimeString(),
      username: localStorage.getItem('username'),
    };

    console.log(sentMessageToBackend);

    this.stompService.stompClient?.publish({
      destination: `/app/message`,
      body: JSON.stringify(sentMessageToBackend),
    });

    this.newMessage = '';
  }
}
