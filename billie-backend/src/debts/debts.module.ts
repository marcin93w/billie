import { Module } from '@nestjs/common';
import { DatabaseService } from '../common/database.service';
import { DebtsLedgerRepository } from './debts-ledger.repository';
import { AddDebtHandler } from './add-debt.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [DatabaseService, DebtsLedgerRepository, AddDebtHandler],
})
export class DebtsModule {}
