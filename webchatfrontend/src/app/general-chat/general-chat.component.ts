import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socketservices/socket.service';
import { HttpService } from '../services/httpservices/http.service';

interface Message {
  message: string;
  senderID: number;
  username: string;
  time: string;
  isCurrentUser: boolean;
  imageURL?: string; // URL from backend
  avatar?: string; // Data URL for display
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
  public messages: Message[] = [];
  newMessage: string = '';
  private imageCache: { [url: string]: string } = {};

  constructor(
    public stompService: SocketService,
    private httpService: HttpService
  ) {
    this.isConnectedSubscription = stompService.isConnected.subscribe(
      (connected) => {
        this.isConnected = connected;
        if (this.isConnected) {
          this.connect();

          this.httpService.getAllMessages().subscribe(
            (res: any) => {
              console.log('res: ', res);
              this.messages = []; // clear before loading
              for (let msg of res) {
                const isCurrentUser =
                  Number(msg.senderID) === Number(this.userID);
                const pushedMessage: Message = {
                  message: msg.message,
                  senderID: msg.senderID,
                  username: msg.username,
                  time: msg.time,
                  isCurrentUser: isCurrentUser,
                  imageURL: msg.imageURL,
                  avatar: 'assets/default-avatar.png',
                };
                this.messages.push(pushedMessage);
                if (msg.imageURL) {
                  this.loadAvatar(msg.imageURL, pushedMessage);
                }
              }
              console.log('messages array: after push: ', this.messages);
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
      }
    );
  }

  ngOnInit(): void {}

  connect() {
    if (this.isConnected) {
      this.stompService.stompClient?.subscribe(`/topic/message`, (message) => {
        const receivedMessages = JSON.parse(message.body);
        this.messages = [];
        for (let msg of receivedMessages) {
          const isCurrentUser = Number(msg.senderID) === Number(this.userID);
          const pushedMessage: Message = {
            message: msg.message,
            senderID: msg.senderID,
            username: msg.username,
            time: msg.time,
            isCurrentUser: isCurrentUser,
            imageURL: msg.imageURL,
            avatar: 'assets/default-avatar.png', // default
          };
          this.messages.push(pushedMessage);

          // Fetch the avatar if imageURL is present
          if (msg.imageURL) {
            this.loadAvatar(msg.imageURL, pushedMessage);
          }
        }
      });
    }
  }

  loadAvatar(url: string, message: Message) {
    // Use cache if available
    if (this.imageCache[url]) {
      message.avatar = this.imageCache[url];
      return;
    }
    // Extract user ID from the URL
    const match = url.match(/\/users\/(\d+)\/profile-picture/);
    if (match) {
      const userId = match[1];
      this.httpService.loadProfilePicture(userId).subscribe(
        (blob) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            message.avatar = e.target.result;
            this.imageCache[url] = e.target.result;
          };
          reader.readAsDataURL(blob);
        },
        (err) => {
          message.avatar = 'assets/default-avatar.png';
        }
      );
    } else {
      message.avatar = 'assets/default-avatar.png';
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const id = localStorage.getItem('userID');
    const imageURL: string = `http://localhost:8080/users/${id}/profile-picture`;

    const sentMessageToBackend = {
      message: this.newMessage,
      senderID: Number(this.userID),
      time: new Date().toLocaleTimeString(),
      username: localStorage.getItem('username'),
      imageURL: imageURL,
    };

    this.stompService.stompClient?.publish({
      destination: `/app/message`,
      body: JSON.stringify(sentMessageToBackend),
    });

    this.newMessage = '';
  }
}
