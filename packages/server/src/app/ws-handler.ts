import { IncomingMessage } from 'http';
import {WebSocket, WebSocketServer, ServerOptions, RawData} from 'ws';

export class WsHandler{
    private wsServer: WebSocketServer

    initialize(options: ServerOptions){
        this.wsServer = new WebSocketServer(options);

        this.wsServer.on('listening', () => console.log(`Server is listening on http://localhost:${options.port}`));
        this.wsServer.on('connection', (socket:WebSocket, request:IncomingMessage)=> this.onSockeConnection(socket, request) );

    }

    onSockeConnection(socket: import("ws"), request: IncomingMessage): void {
        console.log("New Web Socket Connection");

        socket.on('message', (data: RawData) => this.onSocketMessage(socket, data));
        socket.on('close',(code: number, reason: Buffer) => this.onSocketClose(code, reason))
    }
    
    onSocketMessage(socket: import("ws"), data: RawData): void {
        var payload = JSON.parse(`${data}`);
        
        console.log("Recieved: ", payload);
        
        var reply = JSON.stringify({messge: "Message Recieved"})
        socket.send(reply);
    }

    onSocketClose(code: number, reason: Buffer): void {
        console.log(`Client has disconnected. Code: ${code} , Reason: ${reason}`)
    }
}