import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: [
      'Content-Type',
      'x-signed-request',
      'x-user-id', // TODO remove in release version
      'x-thread-id'], // TODO remove in release version
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: 'http://localhost:8080',
  });
  await app.listen(3000);
}
bootstrap();
