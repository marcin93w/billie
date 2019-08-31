import { Module } from '@nestjs/common';
import { DatabaseService } from '../data/database.service';
import { DebtsLedgerRepository } from './debts-ledger.repository';
import { AddDebtHandler } from './add-debt.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AcceptLedgerHandler } from './accept-ledger.handler';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [DatabaseService, DebtsLedgerRepository, AddDebtHandler, AcceptLedgerHandler],
})
export class DebtsModule {}
