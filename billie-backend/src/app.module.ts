import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DebtsModule } from './debts/debts.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ApiModule, DebtsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
