import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await setupApp(app);
  const port = Number(process.env.PORT ?? 8080);
  await app.listen(port);
}

bootstrap();
