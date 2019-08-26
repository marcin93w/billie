import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthMiddleware } from './auth.middleware';
import { CqrsModule } from '@nestjs/cqrs';
import { SignInService } from '../users/sign-in.service';
import { GraphApiService } from '../users/graph-api.service';
import { DatabaseService } from '../common/database.service';
import { GetLedgerQuery } from '../queries/get-ledger.query';

@Module({
  imports: [CqrsModule],
  controllers: [ApiController],
  providers: [SignInService, GraphApiService, DatabaseService, AuthMiddleware, GetLedgerQuery],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
