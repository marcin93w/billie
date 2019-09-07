import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  fbPageAccessToken: string = process.env.PAGE_ACCESS_TOKEN;
  fbGraphApiUrl = 'https://graph.facebook.com/v2.6/';
  fbAppSecret: string = process.env.APP_SECRET;
}
