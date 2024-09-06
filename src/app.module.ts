// Módulo raiz que integra todos os módulos do projeto
import { Module } from '@nestjs/common';
import { AnimeModule } from './anime/anime.module';

@Module({
  imports: [AnimeModule],
  })
export class AppModule {}

