import { HttpService, Injectable } from '@nestjs/common';
import { User } from './user.type';
import { ConfigService } from '../api/config.service';

@Injectable()
export class GraphApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService) {}

  async fetchUserData(userFbId: string): Promise<User> {
    const response = await this.httpService.get(
      `${this.configService.fbGraphApiUrl}${userFbId}?access_token=${this.configService.fbPageAccessToken}`)
      .toPromise();

    if (response.status !== 200) {
      throw new Error(`Cannot call FB Graph API: ${response.statusText}`);
    }

    const data = response.data;
    return {
      id: data.id,
      name: data.first_name,
      fullName: `${data.first_name} ${data.last_name}`,
      gender: data.first_name.endsWith('a') ? 'female' : 'male',
      avatarUrl: data.avatar_url,
    };
  }
}
