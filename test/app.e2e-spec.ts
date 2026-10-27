import { AddressInfo } from 'net';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';
import { io, Socket } from 'socket.io-client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/app.setup';

const payload = {
  title: 'Neon Genesis Evangelion',
  description: 'Um clássico de 1995',
  completed: false,
  releaseDate: '1995-10-04',
  type: 'série',
  ranking: 10,
};

describe('Animes (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) {
      throw new Error('Defina DATABASE_URL. Use npm run test:e2e.');
    }

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setupApp(app);
    await app.init();
    await app.listen(0);
  }, 60000);

  beforeEach(async () => {
    const orm = app.get(MikroORM);
    await orm.em.getConnection().execute('truncate table "animes"');
    orm.em.clear();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /health responde ok', () => {
    return request(app.getHttpServer()).get('/health').expect(200).expect({
      status: 'ok',
    });
  });

  it('recusa um anime sem título', () => {
    return request(app.getHttpServer())
      .post('/anime')
      .send({ ...payload, title: '' })
      .expect(400);
  });

  it('faz o CRUD e emite anime.created', async () => {
    const port = (app.getHttpServer().address() as AddressInfo).port;
    const socket = io(`http://127.0.0.1:${port}`, {
      transports: ['websocket'],
    });
    await waitForConnect(socket);
    const createdEvent = waitForEvent(socket, 'anime.created');

    const created = await request(app.getHttpServer())
      .post('/anime')
      .send(payload)
      .expect(201);

    expect(created.body).toMatchObject({
      title: payload.title,
      releaseDate: '1995-10-04',
      type: 'série',
      ranking: 10,
    });
    expect(created.body.id).toEqual(expect.any(String));
    await expect(createdEvent).resolves.toMatchObject({ title: payload.title });

    const id = created.body.id as string;

    await request(app.getHttpServer())
      .get('/anime')
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(1);
      });

    await request(app.getHttpServer())
      .put(`/anime/${id}`)
      .send({ completed: true, ranking: 8 })
      .expect(200)
      .expect((response) => {
        expect(response.body.completed).toBe(true);
        expect(response.body.ranking).toBe(8);
        expect(response.body.title).toBe(payload.title);
      });

    await request(app.getHttpServer())
      .delete(`/anime/${id}`)
      .expect(200);

    await request(app.getHttpServer()).get(`/anime/${id}`).expect(404);
    await request(app.getHttpServer()).get('/anime/1').expect(404);

    socket.close();
  });

  it('valida a capa e avisa quando o S3 não está configurado', async () => {
    const created = await request(app.getHttpServer())
      .post('/anime')
      .send(payload)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/anime/${created.body.id}/cover`)
      .attach('file', Buffer.from('not-an-image'), {
        filename: 'cover.txt',
        contentType: 'text/plain',
      })
      .expect(400);

    await request(app.getHttpServer())
      .post(`/anime/${created.body.id}/cover`)
      .attach('file', Buffer.from('png'), {
        filename: 'cover.png',
        contentType: 'image/png',
      })
      .expect(503);
  });

  it('documenta a API em /docs', () => {
    return request(app.getHttpServer()).get('/docs').expect(200);
  });
});

function waitForConnect(socket: Socket) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('socket timeout')), 5000);
    socket.on('connect', () => {
      clearTimeout(timer);
      resolve();
    });
    socket.on('connect_error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

function waitForEvent(socket: Socket, eventName: string) {
  return new Promise<unknown>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`evento ${eventName} não chegou`)),
      5000,
    );
    socket.once(eventName, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}
