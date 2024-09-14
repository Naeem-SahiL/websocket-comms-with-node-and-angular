import { IncomingMessage } from 'http';
import {WebSocket, WebSocketServer, ServerOptions, RawData} from 'ws';
import { UserManager } from './user-manager';
import { WsMessage } from '@websocket/types';

export class WsHandler{
    private wsServer: WebSocketServer
    private userManager: UserManager

    initialize(options: ServerOptions){
        this.wsServer = new WebSocketServer(options);
        this.userManager = new UserManager();

        this.wsServer.on('listening', () => console.log(`Server is listening on http://localhost:${options.port}`));
        this.wsServer.on('connection', (socket:WebSocket, request:IncomingMessage)=> this.onSockeConnection(socket, request) );

    }

    onSockeConnection(socket: import("ws"), request: IncomingMessage): void {
        console.log(`New Web Socket Connection ${request.url}`);
        this.userManager.add(socket, request);

        socket.on('message', (data: RawData) => this.onSocketMessage(socket, data));
        socket.on('close',(code: number, reason: Buffer) => this.onSocketClose(socket,code, reason))
    }

    onSocketMessage(socket: import("ws"), data: RawData): void {
        const payload: WsMessage = JSON.parse(`${data}`);

        console.log("Recieved: ", payload);

        this.userManager.sendToAll(payload);
    }

    onSocketClose(socket:WebSocket, code: number, reason: Buffer): void {
        console.log(`Client has disconnected. Code: ${code} , Reason: ${reason}`);
        this.userManager.remove(socket);
    }
}
