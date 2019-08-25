import { DatabaseService } from '../common/database.service';
import { DebtsLedger } from './debts-ledger.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DebtsLedgerRepository {
  private readonly collectionName = 'debt-ledgers';

  constructor(private readonly db: DatabaseService) {}

  async save(ledger: DebtsLedger): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.executeOnCollection(this.collectionName, collection => {
        collection.updateOne(
          { threadId: ledger.getThreadId() },
          { $set: ledger },
          { upsert: true },
          error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
      });
    });
  }

  async find(threadId: string): Promise<DebtsLedger> {
    return new Promise((resolve, reject) => {
      this.db.executeOnCollection(this.collectionName, collection => {
        collection.findOne({ threadId }, (error, data) => {
            if (error) {
              reject(error);
            } else {
              resolve(data ? DebtsLedger.deserialize(data) : null);
            }
          });
      });
    });
  }
}
