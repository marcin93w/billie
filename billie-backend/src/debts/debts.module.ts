import { Module } from '@nestjs/common';
import { DatabaseService } from '../common/database.service';
import { DebtsLedgerRepository } from './debts-ledger.repository';
import { AddDebtHandler } from './add-debt.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { AcceptLedgerHandler } from './accept-ledger.handler';
import { ConfigService } from '../common/config.service';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [ConfigService, DatabaseService, DebtsLedgerRepository, AddDebtHandler, AcceptLedgerHandler],
})
export class DebtsModule {}
