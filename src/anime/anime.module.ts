import { Module } from '@nestjs/common';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';
import { AnimeDao } from './dao/anime.dao';


@Module({controllers: [AnimeController],
    providers: [AnimeService, AnimeDao],
})
export class AnimeModule {}
