import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { SignInService } from '../users/sign-in.service';
import { ApiRequest } from './api-request.type';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly signInService: SignInService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const userFbId = req.header('x-user-id');
    const threadId = req.header('x-thread-id');

    if (!userFbId || !threadId) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const user = await this.signInService.signIn(userFbId);

    if (!user) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    (req as ApiRequest).user = user;
    (req as ApiRequest).threadId = threadId;

    next();
  }
}
