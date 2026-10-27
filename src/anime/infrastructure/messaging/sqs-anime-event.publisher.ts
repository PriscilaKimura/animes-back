import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { AnimeEvent } from '../../domain/anime-event';
import { SqsConnection } from './sqs.connection';

@Injectable()
export class SqsAnimeEventPublisher {
  private readonly logger = new Logger(SqsAnimeEventPublisher.name);

  constructor(private readonly sqs: SqsConnection) {}

  async publish(event: AnimeEvent): Promise<void> {
    if (!this.sqs.isReady() || !this.sqs.client) {
      return;
    }

    try {
      await this.sqs.client.send(
        new SendMessageCommand({
          QueueUrl: this.sqs.queueUrl,
          MessageBody: JSON.stringify(event),
        }),
      );
    } catch (error) {
      this.logger.error(
        `Falha ao publicar ${event.name}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
