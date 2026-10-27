import EmbeddedPostgres from 'embedded-postgres';
import { access, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const databaseDir = path.join(root, '.pgdata');
await mkdir(databaseDir, { recursive: true });

const postgres = new EmbeddedPostgres({
  databaseDir,
  user: 'animes',
  password: 'animes',
  port: 5433,
  persistent: true,
});

const clusterReady = await access(path.join(databaseDir, 'PG_VERSION'))
  .then(() => true)
  .catch(() => false);

if (!clusterReady) {
  await postgres.initialise();
}

await postgres.start();

for (const name of ['animes', 'animes_test']) {
  try {
    await postgres.createDatabase(name);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/already exists/i.test(message)) {
      throw error;
    }
  }
}

console.log('PostgreSQL em postgresql://animes:animes@127.0.0.1:5433/animes');

const shutdown = async () => {
  await postgres.stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
