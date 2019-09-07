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
  contact?: {
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
    if (!ledger) {
      return null;
    }

    if (ledger.hostUserId !== user.id && ledger.guestUserId !== user.id) {
      return null;
    }

    let contact: User;
    if (ledger.guestUserId) {
      const contactId = ledger.hostUserId === user.id ? ledger.guestUserId : ledger.hostUserId;
      contact = await this.db.users.findOne({ id: contactId });
    }

    return {
      balance: ledger.balance,
      debts: ledger.debts,
      user,
      contact,
    };
  }
}
