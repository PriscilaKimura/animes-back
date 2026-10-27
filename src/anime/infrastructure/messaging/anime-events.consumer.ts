import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SqsConnection } from './sqs.connection';

@Injectable()
export class AnimeEventsConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AnimeEventsConsumer.name);
  private running = false;
  private abort: AbortController | null = null;

  constructor(private readonly sqs: SqsConnection) {}

  onModuleInit() {
    if (!this.sqs.isReady() || !this.sqs.client) {
      return;
    }
    this.running = true;
    this.abort = new AbortController();
    void this.poll();
  }

  onModuleDestroy() {
    this.running = false;
    this.abort?.abort();
  }

  private async poll() {
    while (this.running && this.sqs.client) {
      try {
        const response = await this.sqs.client.send(
          new ReceiveMessageCommand({
            QueueUrl: this.sqs.queueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 5,
          }),
          { abortSignal: this.abort?.signal },
        );

        for (const message of response.Messages ?? []) {
          this.logger.log(`Evento consumido da fila: ${message.Body}`);
          if (!message.ReceiptHandle) {
            continue;
          }
          await this.sqs.client.send(
            new DeleteMessageCommand({
              QueueUrl: this.sqs.queueUrl,
              ReceiptHandle: message.ReceiptHandle,
            }),
          );
        }
      } catch (error) {
        if (!this.running) {
          return;
        }
        this.logger.error(
          'Falha ao consumir a fila de animes',
          error instanceof Error ? error.stack : String(error),
        );
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
}
