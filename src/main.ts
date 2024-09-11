// Arquivo principal que inicializa a aplicação NestJS
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Ativa a validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não especificadas no DTO
   // forbidNonWhitelisted: true, // Retorna erro se propriedades não especificadas forem enviadas
   // transform: true, // Transforma automaticamente o payload para o tipo definido no DTO
  }));
  
  app.enableCors(); // Habilita CORS para comunicação com o frontend
  await app.listen(8080);
}

bootstrap();







