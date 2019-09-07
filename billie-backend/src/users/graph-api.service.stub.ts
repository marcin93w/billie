import { Injectable } from '@nestjs/common';
import { User } from './user.type';
import { IGraphApiService } from './graph-api.service.interface';

@Injectable()
export class GraphApiServiceStub implements IGraphApiService {
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
