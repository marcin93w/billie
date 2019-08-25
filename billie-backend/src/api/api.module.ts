import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiController } from './api.controller';
import { UsersModule } from '../users/users.module';
import { AuthMiddleware } from './auth.middleware';
import { CqrsModule } from '@nestjs/cqrs';
import { SignInService } from '../users/sign-in.service';
import { UsersRepository } from '../users/users.repository';
import { GraphApiService } from '../users/graph-api.service';
import { DatabaseService } from '../common/database.service';

@Module({
  imports: [UsersModule, CqrsModule],
  controllers: [ApiController],
  providers: [UsersRepository, SignInService, GraphApiService, DatabaseService, AuthMiddleware],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
