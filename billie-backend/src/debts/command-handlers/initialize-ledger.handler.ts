import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InitializeLedgerCommand } from '../contracts/initialize-ledger.command';
import { DebtsLedger } from '../domain/debts-ledger.model';
import { DebtsLedgerRepository } from '../domain/debts-ledger.repository';

@CommandHandler(InitializeLedgerCommand)
export class InitializeLedgerHandler implements ICommandHandler<InitializeLedgerCommand> {
  constructor(private readonly debtsLedgerRepository: DebtsLedgerRepository) {}

  async execute(command: InitializeLedgerCommand): Promise<any> {
    const { userId, threadId } = command;
    
    let debtsLedger = await this.debtsLedgerRepository.find(threadId)
    
    if (debtsLedger) {
      debtsLedger.accept(userId);
    } else {
      debtsLedger = new DebtsLedger(threadId, userId);
    }

    await this.debtsLedgerRepository.save(debtsLedger);
  }
}
