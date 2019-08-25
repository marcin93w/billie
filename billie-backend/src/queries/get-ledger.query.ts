import { DatabaseService } from '../common/database.service';
import { DebtsLedgerSchema, UserSchema } from '../common/database.schema';
import { User } from '../users/user.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetLedgerQuery {
  constructor(private readonly dbService: DatabaseService) {}

  async fetch(threadId: string, user: User): Promise<any> {
    const client = await this.dbService.connect();
    const db = client.db('billie');

    const ledger = await db.collection('debt-ledgers').findOne<DebtsLedgerSchema>({threadId});
    const contact = ledger.guestUserId ? (await db.collection('users').findOne<UserSchema>({id: ledger.guestUserId})) : null;

    await client.close();

    return {
      balance: ledger.balance,
      debts: ledger.debts,
      user,
      contact,
    };
  }
}
