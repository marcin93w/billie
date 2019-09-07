import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.type';
import { DatabaseService } from '../common/database.service';
import { GRAPH_API_SERVICE, IGraphApiService } from './graph-api.service.interface';

@Injectable()
export class SignInService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(GRAPH_API_SERVICE) private readonly graphApiService: IGraphApiService,
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
