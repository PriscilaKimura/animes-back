import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AnimeService } from './application/anime.service';
import { CatalogService } from './application/catalog.service';
import { ANIME_CATALOG } from './domain/anime-catalog';
import { ANIME_NOTIFIER } from './domain/anime-event';
import { COVER_STORAGE } from './domain/cover-storage';
import { ANIME_REPOSITORY } from './domain/anime.repository';
import { AnilistAnimeCatalog } from './infrastructure/catalog/anilist-anime.catalog';
import { AnimeController } from './infrastructure/http/anime.controller';
import { CatalogController } from './infrastructure/http/catalog.controller';
import { AnimeNotifierAdapter } from './infrastructure/messaging/anime-notifier.adapter';
import { AnimeEventsConsumer } from './infrastructure/messaging/anime-events.consumer';
import { SqsAnimeEventPublisher } from './infrastructure/messaging/sqs-anime-event.publisher';
import { SqsConnection } from './infrastructure/messaging/sqs.connection';
import { AnimeOrmEntity } from './infrastructure/persistence/anime.orm-entity';
import { MikroAnimeRepository } from './infrastructure/persistence/mikro-anime.repository';
import { S3CoverStorage } from './infrastructure/storage/s3-cover.storage';
import { AnimeGateway } from './infrastructure/websocket/anime.gateway';

@Module({
  imports: [MikroOrmModule.forFeature([AnimeOrmEntity])],
  controllers: [AnimeController, CatalogController],
  providers: [
    AnimeService,
    CatalogService,
    AnimeGateway,
    SqsConnection,
    SqsAnimeEventPublisher,
    AnimeEventsConsumer,
    {
      provide: ANIME_REPOSITORY,
      useClass: MikroAnimeRepository,
    },
    {
      provide: ANIME_NOTIFIER,
      useClass: AnimeNotifierAdapter,
    },
    {
      provide: COVER_STORAGE,
      useClass: S3CoverStorage,
    },
    {
      provide: ANIME_CATALOG,
      useClass: AnilistAnimeCatalog,
    },
  ],
})
export class AnimeModule {}
