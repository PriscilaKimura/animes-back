import { UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { config as loadEnv } from 'dotenv';
import { join } from 'path';
import { AnimeOrmEntity } from '../anime/infrastructure/persistence/anime.orm-entity';

loadEnv();

export function createMikroOrmOptions(clientUrl: string) {
  const needsSsl =
    process.env.DATABASE_SSL === 'true' ||
    /render\.com|sslmode=require/i.test(clientUrl);

  return defineConfig({
    driver: PostgreSqlDriver,
    clientUrl,
    entities: [AnimeOrmEntity],
    namingStrategy: UnderscoreNamingStrategy,
    allowGlobalContext: true,
    extensions: [Migrator],
    ...(needsSsl
      ? {
          driverOptions: {
            connection: {
              ssl: { rejectUnauthorized: false },
            },
          },
        }
      : {}),
    migrations: {
      path: join(process.cwd(), 'dist/database/migrations'),
      pathTs: join(process.cwd(), 'src/database/migrations'),
      glob: '!(*.d).{js,ts}',
    },
  });
}

export default createMikroOrmOptions(
  process.env.DATABASE_URL ?? 'postgresql://animes:animes@localhost:5432/animes',
);
