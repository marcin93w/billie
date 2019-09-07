import { Request } from 'express';
import { User } from '../../users/user.type';

export interface ApiRequest extends Request {
  user: User;
  threadId: string;
}
