import { Injectable } from '@nestjs/common';
import { User } from './user.type';
import { UsersRepository } from './users.repository';
import { GraphApiService } from './graph-api.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly graphApiService: GraphApiService,
  ) {}

  async signIn(userFbId: string): Promise<User> {
    let user = await this.usersRepository.find(userFbId);
    if (user) {
      return user;
    }

    user = await this.graphApiService.fetchUserData(userFbId);
    await this.usersRepository.save(user);

    return user;
  }
}
