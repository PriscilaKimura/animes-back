import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoverFile, CoverStorage } from '../../domain/cover-storage';

@Injectable()
export class S3CoverStorage implements CoverStorage, OnModuleInit {
  private readonly logger = new Logger(S3CoverStorage.name);
  private client: S3Client | null = null;
  private bucket = '';
  private publicBaseUrl = '';

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.bucket = this.config.get<string>('S3_BUCKET') ?? '';
    if (!this.bucket) {
      this.logger.log('S3_BUCKET vazio. Upload de capa fica desligado.');
      return;
    }

    const endpoint = this.config.get<string>('S3_ENDPOINT');
    this.publicBaseUrl = (
      this.config.get<string>('S3_PUBLIC_BASE_URL') ??
      `http://localhost:4566/${this.bucket}`
    ).replace(/\/$/, '');

    this.client = new S3Client({
      region: this.config.get<string>('AWS_REGION') ?? 'us-east-1',
      endpoint: endpoint || undefined,
      forcePathStyle: Boolean(endpoint),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') ?? 'test',
        secretAccessKey:
          this.config.get<string>('AWS_SECRET_ACCESS_KEY') ?? 'test',
      },
    });

    if (!endpoint) {
      return;
    }

    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
        return;
      } catch (error) {
        const name = error instanceof Error ? error.name : '';
        if (name.includes('BucketAlready')) {
          return;
        }
        if (attempt === 5) {
          this.logger.error(
            'Não foi possível preparar o bucket de capas.',
            error instanceof Error ? error.stack : String(error),
          );
          this.client = null;
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }

  async upload(file: CoverFile): Promise<string> {
    if (!this.client || !this.bucket) {
      throw new ServiceUnavailableException(
        'Storage de capas não está configurado.',
      );
    }

    const safeName = file.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `covers/${file.animeId}/${Date.now()}-${safeName}`;

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.body,
          ContentType: file.contentType,
        }),
      );
    } catch (error) {
      this.logger.error(
        'Falha ao enviar a capa',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException('Não foi possível salvar a capa.');
    }

    return `${this.publicBaseUrl}/${key}`;
  }
}
