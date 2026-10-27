import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AnimeEvent } from '../../domain/anime-event';

@WebSocketGateway({ cors: { origin: '*' } })
export class AnimeGateway {
  @WebSocketServer()
  server: Server;

  emit(event: AnimeEvent) {
    this.server?.emit(event.name, event.data);
  }
}
