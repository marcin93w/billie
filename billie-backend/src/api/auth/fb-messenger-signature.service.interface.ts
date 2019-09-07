export const FB_MESSENGER_SIGNATURE_SERVICE = 'FB_MESSENGER_SIGNATURE_SERVICE'

export interface FbMessengerSignatureData {
  threadId: string;
  userId: string;
  threadType: string;
}

export interface IFbMessengerSignatureService {
  parseSignature(hash: string): FbMessengerSignatureData;
}
