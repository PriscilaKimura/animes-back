// Arquivo principal que inicializa a aplicação NestJS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para comunicação com o frontend
  await app.listen(8080);
}
bootstrap();







