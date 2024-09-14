import {WsMessage, User} from '@websocket/types';
import { IncomingMessage } from 'http';
import WebSocket = require("ws");

export class UserManager {
  private sockets = new Map<WebSocket, User>();
  private user_id = 0;

  add(socket: WebSocket, request:IncomingMessage) {
    const fullUrl = new URL(request.headers.host + request.url);
    const name = fullUrl.searchParams.get('name') || 'Anonymous';

    const user: User = {
      name: name,
      id: this.user_id++
    }

    this.sendToAll({event:'system-notice', contents:`${user.name} has joined the chat.` })
    this.sockets.set(socket, user);
  }

  remove(socket: WebSocket) {
    this.sockets.delete(socket);
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
}
