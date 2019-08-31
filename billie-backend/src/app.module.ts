import { Module } from '@nestjs/common';
import { DebtsModule } from './debts/debts.module';
import { ApiModule } from './api/api.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [ApiModule, DebtsModule, GraphQLModule.forRoot({autoSchemaFile: 'schema.gql'})],
  controllers: [],
  providers: [],
})
export class AppModule {}
