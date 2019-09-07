import { DatabaseService } from '../common/database.service';
import { User } from '../users/user.type';
import { Injectable } from '@nestjs/common';

export interface LedgerDto {
  balance: number;
  debts: [{
    type: number;
    amount: number;
    comment: string;
    date: string;
  }];
  user: {
    id: string;
    name: string;
    fullName: string;
    avatarUrl: string;
    gender: string;
  };
  contact: {
    id: string;
    name: string;
    fullName: string;
    avatarUrl: string;
    gender: string;
  };
}

@Injectable()
export class GetLedgerQuery {
  constructor(private readonly db: DatabaseService) {}

  async fetch(threadId: string, user: User): Promise<LedgerDto> {
    const ledger = await this.db.debtsLedgers.findOne({threadId});
    const contact = ledger.guestUserId ? (await this.db.users.findOne({id: ledger.guestUserId})) : null;

    return {
      balance: ledger.balance,
      debts: ledger.debts,
      user,
      contact,
    };
  }
}
