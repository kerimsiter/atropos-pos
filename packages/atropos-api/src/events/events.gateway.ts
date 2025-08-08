import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    // Optionally, you can authenticate clients here in the future
    // console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
  }

  emitNewOrder(order: any) {
    // Broadcast to all connected clients
    this.server.emit('new_order', order);
  }

  emitOrderStatusUpdated(order: any) {
    this.server.emit('order_status_updated', order);
  }
}
