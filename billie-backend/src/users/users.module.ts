import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SignInService } from './sign-in.service';
import { GraphApiService } from './graph-api.service';
import { DatabaseService } from '../common/database.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UsersRepository, SignInService, GraphApiService, DatabaseService],
})
export class UsersModule {}
