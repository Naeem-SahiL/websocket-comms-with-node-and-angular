import { Injectable } from "@angular/core";
import { ChatRelayMessage, User, WsMessage } from "@websocket/types";
import { BehaviorSubject, Subject } from "rxjs";
import { WebSocketSubject, webSocket } from "rxjs/webSocket"

@Injectable()
export class AppService {
  user$ = new BehaviorSubject<User>(undefined);
  userList$ = new BehaviorSubject<User[]>([]);
  chatMessage$ = new Subject<ChatRelayMessage>();
  systemNotice$ = new Subject<WsMessage>();
  socket: WebSocketSubject<WsMessage>;

  connect(name: string) {
    this.socket = webSocket('ws://localhost:8080?name=' + name);

    this.socket.subscribe((data: WsMessage) => {
      switch(data.event) {
        case 'login':
          this.user$.next(data.user);
          break;
        case 'chat-relay':
          this.chatMessage$.next(data);
          break;
        case 'system-notice':
          this.systemNotice$.next(data);
          break;
        case 'user-list':
          this.userList$.next(data.users);
          break;
      }

    });
  }

  sendMessage(contents: string) {
    let message: WsMessage = {
      event: 'chat',
      contents: contents
    }

    this.socket.next(message);
  }

}
