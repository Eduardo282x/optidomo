
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected ${client.id}`);
    }

    @SubscribeMessage('areaDevicesUpdate')
    handleAreaDevices(@ConnectedSocket() client: Socket, @MessageBody() data: any[]) {
        client.broadcast.emit('areaDevicesUpdate', data)
    }

    @SubscribeMessage('accessLogUpdate')
    handleAccess(@ConnectedSocket() client: Socket, @MessageBody() data: any[]) {
        client.emit('accessLogUpdate', data)
    }

    @SubscribeMessage('message')
    handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        console.log(data);
        client.broadcast.emit('message', data)
    }
}

