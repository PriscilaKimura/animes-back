import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnimeModule } from './anime/anime.module';
import { createMikroOrmOptions } from './database/mikro-orm.config';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createMikroOrmOptions(config.getOrThrow<string>('DATABASE_URL')),
    }),
    AnimeModule,
    HealthModule,
  ],
})
export class AppModule {}
