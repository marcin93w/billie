import { FbMessengerSignatureData, IFbMessengerSignatureService } from './fb-messenger-signature.service.interface';
import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { ConfigService } from '../../common/config.service';

@Injectable()
export class FbMessengerSignatureService implements IFbMessengerSignatureService {
  constructor(private readonly config: ConfigService) {}

  parseSignature(hash: string): FbMessengerSignatureData {
    if (!hash) {
      throw new Error('Signature hash is empty')
    }

    const signedRequest = hash.split('.');
    const signature = Buffer.from(
        signedRequest[0]
          .replace('-', '+')
          .replace('_', '/'),
      'base64')
      .toString('hex');
    const payload = Buffer.from(signedRequest[1], 'base64').toString('ascii');

    const expectedSignature = createHmac('sha256', this.config.fbAppSecret)
      .update(signedRequest[1])
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature hash')
    }

    const data = JSON.parse(payload);

    return {
      userId: data.psid,
      threadType: data.thread_type,
      threadId: data.tid,
    };
  }
}
