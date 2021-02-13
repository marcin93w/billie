import { DebtType } from "src/debts/contracts/value-objects/debt-type";

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
  debts: DebtSchema[];
  hostUserId: string;
  guestUserId?: string;
}

export interface DebtSchema {
  type: DebtType;
  amount: number;
  comment: string;
  date: Date;
}