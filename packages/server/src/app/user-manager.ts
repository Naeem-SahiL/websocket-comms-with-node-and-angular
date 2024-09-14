import {WsMessage, User} from '@websocket/types';
import { IncomingMessage } from 'http';
import WebSocket = require("ws");

export class UserManager {
  private sockets = new Map<WebSocket, User>();
  private users: User[] = new Array<User>();
  private user_id = 0;

  add(socket: WebSocket, request:IncomingMessage) {
    const fullUrl = new URL(request.headers.host + request.url);
    const name = fullUrl.searchParams.get('name') || 'Anonymous';

    const user: User = {
      name: name,
      id: this.user_id++
    }

    const loginMessage: WsMessage = {event: 'login', user: user}

    socket.send(JSON.stringify(loginMessage));

    this.sendToAll({event:'system-notice', contents:`${user.name} has joined the chat.` })
    this.sockets.set(socket, user);
    this.sendUserList();

  }

  remove(socket: WebSocket) {
    let userName = this.sockets.get(socket).name;
    this.sockets.delete(socket);
    this.sendToAll({event:'system-notice', contents:`${userName} has left the chat.` });

    this.sendUserList();
  }

  send(socket: WebSocket, message: WsMessage) {
    const data = JSON.stringify(message);
    socket.send(data);
  }

  sendToAll(message: WsMessage) {
    const data = JSON.stringify(message);

    Array.from(this.sockets.keys()).forEach((socket: WebSocket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    })
  }

  relayChatMessage(from: WebSocket, message: WsMessage) {
    switch (message.event) {
      case 'chat':
        {
          const user = this.sockets.get(from);
          const chatRelayMessage: WsMessage = {
            event: 'chat-relay',
            contents: message.contents,
            author: user
          }

          this.sendToAll(chatRelayMessage);
          break;
        }
      case 'user-list':
        {

          break;
        }
    }
  }

  sendUserList() {
    const users: User[] = Array.from(this.sockets.values());
    const userListMessage: WsMessage = {
      event: 'user-list',
      users: users
    }

    this.sendToAll(userListMessage);
  }
}
