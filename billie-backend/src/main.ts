import { NestFactory } from '@nestjs/core';
import { DebtsModule } from './debts/debts.module';

async function bootstrap() {
  const app = await NestFactory.create(DebtsModule);
  await app.listen(3000);
}
bootstrap();
