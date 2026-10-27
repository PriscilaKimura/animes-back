import {
  CreateQueueCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsConnection implements OnModuleInit {
  private readonly logger = new Logger(SqsConnection.name);
  private sqs: SQSClient | null = null;

  constructor(private readonly config: ConfigService) {}

  get client(): SQSClient | null {
    return this.sqs;
  }

  get queueUrl(): string {
    return this.config.get<string>('SQS_QUEUE_URL') ?? '';
  }

  isReady(): boolean {
    return this.sqs !== null && this.queueUrl.length > 0;
  }

  async onModuleInit() {
    const queueUrl = this.queueUrl;
    if (!queueUrl) {
      this.logger.log('SQS_QUEUE_URL vazio. Eventos não serão publicados na fila.');
      return;
    }

    const endpoint = this.config.get<string>('SQS_ENDPOINT');
    this.sqs = new SQSClient({
      region: this.config.get<string>('AWS_REGION') ?? 'us-east-1',
      endpoint: endpoint || undefined,
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') ?? 'test',
        secretAccessKey:
          this.config.get<string>('AWS_SECRET_ACCESS_KEY') ?? 'test',
      },
    });

    if (!endpoint) {
      return;
    }

    const queueName = this.config.get<string>('SQS_QUEUE_NAME') ?? 'anime-events';
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await this.sqs.send(new CreateQueueCommand({ QueueName: queueName }));
        return;
      } catch (error) {
        if (attempt === 5) {
          this.logger.error(
            'Não foi possível preparar a fila SQS. A API continua sem publicar eventos.',
            error instanceof Error ? error.stack : String(error),
          );
          this.sqs = null;
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}
