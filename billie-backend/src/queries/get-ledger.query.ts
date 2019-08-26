import { DatabaseService } from '../common/database.service';
import { User } from '../users/user.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetLedgerQuery {
  constructor(private readonly db: DatabaseService) {}

  async fetch(threadId: string, user: User): Promise<any> {
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
