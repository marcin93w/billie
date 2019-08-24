import { DatabaseService } from './database.service';
import { DebtsLedger } from '../domain/debts-ledger.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DebtsLedgerRepository {
  constructor(private readonly db: DatabaseService) {}

  private mockStorage: DebtsLedger;

  save(ledger: DebtsLedger) {
    this.mockStorage = ledger;
  }

  find(firstUserId: string, secondUserId: string) {
    return this.mockStorage;
  }
}
