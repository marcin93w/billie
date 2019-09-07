import { FbMessengerSignatureData, IFbMessengerSignatureService } from './fb-messenger-signature.service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FbMessengerSignatureServiceStub implements IFbMessengerSignatureService {
  parseSignature(hash: string): FbMessengerSignatureData {
    return {
      userId: 'a',
      threadId: 't',
      threadType: 'SINGLE',
    };
  }
}
