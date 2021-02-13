import { FbMessengerSignatureData, IFbMessengerSignatureService } from './fb-messenger-signature.service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FbMessengerSignatureServiceStub implements IFbMessengerSignatureService {
  parseSignature(hash: string): FbMessengerSignatureData {
    const hashParts = hash.split(':')
    return {
      userId: hashParts[0],
      threadId: hashParts[1],
      threadType: 'SINGLE',
    };
  }
}
