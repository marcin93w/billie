import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { SignInService } from '../../users/sign-in.service';
import { ApiRequest } from './api-request.type';
import { FB_MESSENGER_SIGNATURE_SERVICE, IFbMessengerSignatureService } from './fb-messenger-signature.service.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly signInService: SignInService,
    @Inject(FB_MESSENGER_SIGNATURE_SERVICE) private readonly fbMessengerSignatureService: IFbMessengerSignatureService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const requestSignature = req.header('x-signed-request');

    if (!requestSignature) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const signatureData = this.fbMessengerSignatureService.parseSignature(requestSignature);

    if (!signatureData) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }

    const user = await this.signInService.signIn(signatureData.userId);

    if (!user) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }

    (req as ApiRequest).user = user;
    (req as ApiRequest).threadId = signatureData.threadId;

    next();
  }
}
