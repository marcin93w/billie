import { Injectable } from '@nestjs/common';
import { User } from './user.type';
import { IGraphApiService } from './graph-api.service.interface';

@Injectable()
export class GraphApiServiceStub implements IGraphApiService {
  async fetchUserData(userFbId: string): Promise<User> {
    const nameParts = userFbId.split('-')
    return {
      id: userFbId,
      name: nameParts[0],
      fullName: nameParts[0] + ' ' + (nameParts.length > 1 ? nameParts[1] : 'Test'),
      avatarUrl: 'https://www.w3schools.com/howto/img_avatar.png',
      gender: 'male',
    } as User;
  }
}
