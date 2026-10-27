import { Injectable } from '@nestjs/common';
import { AnimeEvent, AnimeNotifier } from '../../domain/anime-event';
import { AnimeGateway } from '../websocket/anime.gateway';
import { SqsAnimeEventPublisher } from './sqs-anime-event.publisher';

@Injectable()
export class AnimeNotifierAdapter implements AnimeNotifier {
  constructor(
    private readonly gateway: AnimeGateway,
    private readonly sqs: SqsAnimeEventPublisher,
  ) {}

  async notify(event: AnimeEvent): Promise<void> {
    this.gateway.emit(event);
    await this.sqs.publish(event);
  }
}
