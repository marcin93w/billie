import { DatabaseService } from '../common/database.service';
import { User } from '../users/user.type';
import { Injectable } from '@nestjs/common';
import { DebtType } from '../debts/contracts/value-objects/debt-type';

export interface LedgerDto {
  balance: number;
  debts: {
    type: DebtType;
    amount: number;
    comment: string;
    date: string;
  }[];
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

    let { balance, debts } = ledger;
    if (ledger.hostUserId !== user.id) {
      balance = -balance;
      debts = debts.map(d => ({ ...d, type: this.getReversedDebtType(d.type)}))
    }

    return {
      balance: balance,
      debts: debts,
      user,
      contact,
    };
  }

  private getReversedDebtType(debtType: DebtType) {
    switch (debtType) {
      case DebtType.BORROWED:
        return DebtType.LENT;
      case DebtType.BORROWED_PAYOFF:
        return DebtType.LENT_PAYOFF;
      case DebtType.LENT:
        return DebtType.BORROWED;
      case DebtType.LENT_PAYOFF:
        return DebtType.BORROWED_PAYOFF;
    }
  }
}
