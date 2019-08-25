import { Injectable } from '@nestjs/common';
import { User } from './user.type';

@Injectable()
export class GraphApiService {
  async fetchUserData(userFbId: string): Promise<User> {
    return {
      id: userFbId,
      name: 'test',
      fullName: 'test full',
      avatarUrl: 'https://www.w3schools.com/howto/img_avatar.png',
      gender: 'male',
    } as User;
  }
}
