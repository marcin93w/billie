import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      allowedHeaders: ['Content-Type', 'x-signed-request'],
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      origin: 'http://localhost:8080',
    },
  });

  app.useStaticAssets(join(__dirname, '..', 'frontend/dist'), {
    setHeaders: (res, path) => {
      if (path.indexOf('index.html') !== -1) {
        res.header('Cache-Control', 'public, no-cache');
      }
    },
  });
  app.useStaticAssets(join(__dirname, '..', 'assets'), { prefix: '/assets' });
  app.getHttpAdapter().get('/privacy', (req, res) => {
    res.redirect('https://termsfeed.com/privacy-policy/d69122341e558761c7a56e0ae60b28ef');
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
