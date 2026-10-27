import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import EmbeddedPostgres from 'embedded-postgres';

const port = 5434;
const databaseDir = await mkdtemp(join(tmpdir(), 'animes-e2e-'));
const postgres = new EmbeddedPostgres({
  databaseDir,
  user: 'animes',
  password: 'animes',
  port,
  persistent: false,
});

await postgres.initialise();
await postgres.start();
await postgres.createDatabase('animes');

const env = {
  ...process.env,
  DATABASE_URL: `postgresql://animes:animes@127.0.0.1:${port}/animes`,
  SQS_QUEUE_URL: '',
  SQS_ENDPOINT: '',
  S3_BUCKET: '',
  S3_ENDPOINT: '',
};

function run(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env,
      shell: true,
    });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

let code = 1;
try {
  console.log(`PostgreSQL de teste em ${env.DATABASE_URL}`);
  code = await run('npm', ['run', 'build']);
  if (code === 0) {
    code = await run('npx', [
      'jest',
      '--config',
      './test/jest-e2e.json',
      '--runInBand',
    ]);
  }
} finally {
  await postgres.stop();
}

process.exit(code);
