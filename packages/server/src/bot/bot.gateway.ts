import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(parseInt(process.env.WEBSOCKET_PORT || '7777'), {
  cors: {
    origin: '*',
  },
})
export class BotGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('handleLog')
  handleLog(@MessageBody() log: string) {
    this.server.emit('handleLog', log);
  }
}
