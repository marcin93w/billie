import { Args, Query, Resolver } from '@nestjs/graphql';
import { DatabaseService } from './database.service';
import { UserSchema } from './user.model';

@Resolver(of => UserSchema)
export class UserResolver {
  constructor(
    private readonly database: DatabaseService,
  ) {}

  @Query(returns => UserSchema)
  async user(@Args({ name: 'id', type: () => String }) id: string) {
    return await this.database.users.findOne({ id });
  }
}
