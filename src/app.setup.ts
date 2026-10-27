import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function setupApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Animes API')
    .setDescription(
      'CRUD de animes. Os dados ficam no PostgreSQL. Create, update e delete emitem anime.created, anime.updated e anime.deleted no WebSocket e na fila SQS.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const orm = app.get(MikroORM);
  await orm.getMigrator().up();
}
