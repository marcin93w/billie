import { Module } from '@nestjs/common';
import { DebtsController } from './debts.controller';
import { DatabaseService } from './infrastructure/database.service';
import { DebtsLedgerRepository } from './infrastructure/debts-ledger-repository.service';
import { AddDebtHandler } from './domain/add-debt.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [DebtsController],
  providers: [DatabaseService, DebtsLedgerRepository, AddDebtHandler],
})
export class DebtsModule {}
