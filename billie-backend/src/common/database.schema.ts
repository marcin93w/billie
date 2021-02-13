export interface UserSchema {
  id: string;
  name: string;
  fullName: string;
  gender: string;
  avatarUrl: string;
}

export interface DebtsLedgerSchema {
  threadId: string;
  balance: number;
  debts: {
    type: number;
    amount: number;
    comment: string;
    date: string;
  }[];
  hostUserId: string;
  guestUserId?: string;
}
