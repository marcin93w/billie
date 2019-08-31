import { Args, Query, Resolver } from '@nestjs/graphql';
import { DebtsLedgerSchema } from './debts-ledger.model';
import { DatabaseService } from './database.service';

@Resolver(of => DebtsLedgerSchema)
export class DebtsLedgerResolver {
  constructor(
    private readonly database: DatabaseService,
  ) {
  }

  @Query(returns => DebtsLedgerSchema)
  async debtsLedger(@Args({ name: 'threadId', type: () => String }) threadId: string) {
    return await this.database.debtsLedgers.findOne({ threadId });
  }
}
