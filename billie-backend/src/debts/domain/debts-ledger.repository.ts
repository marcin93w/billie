import { DatabaseService } from '../../common/database.service';
import { DebtsLedger } from './debts-ledger.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DebtsLedgerRepository {
  constructor(private readonly db: DatabaseService) {}

  async save(ledger: DebtsLedger): Promise<void> {
    await this.db.debtsLedgers.updateOne(
      { threadId: ledger.getThreadId() },
      { $set: ledger.export() },
      { upsert: true });
  }

  async find(threadId: string): Promise<DebtsLedger> {
    const ledgerData = await this.db.debtsLedgers.findOne({ threadId });
    return ledgerData ? DebtsLedger.createFrom(ledgerData) : null;
  }
}
