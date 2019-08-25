import { Module } from '@nestjs/common';
import { DebtsModule } from './debts/debts.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ApiModule, DebtsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
