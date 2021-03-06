import { Module } from '@nestjs/common';
import { DatabaseService } from '../common/database.service';
import { AddDebtHandler } from './command-handlers/add-debt.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { InitializeLedgerHandler } from './command-handlers/initialize-ledger.handler';
import { ConfigService } from '../common/config.service';
import { DebtsLedgerRepository } from './domain/debts-ledger.repository';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [ConfigService, DatabaseService, DebtsLedgerRepository, AddDebtHandler, InitializeLedgerHandler],
})
export class DebtsModule {}
