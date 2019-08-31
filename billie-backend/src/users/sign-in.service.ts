import { Injectable } from '@nestjs/common';
import { User } from './user.type';
import { GraphApiService } from './graph-api.service';
import { DatabaseService } from '../data/database.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly db: DatabaseService,
    private readonly graphApiService: GraphApiService,
  ) {}

  async signIn(userFbId: string): Promise<User> {
    let user = await this.db.users.findOne({ id: userFbId });
    if (user) {
      return user;
    }

    user = await this.graphApiService.fetchUserData(userFbId);
    await this.db.users.insertOne(user);

    return user;
  }
}
