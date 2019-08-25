import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebtsLedgerRepository } from './debts-ledger.repository';
import { DebtsLedger } from './debts-ledger.model';
import { AcceptLedgerCommand } from './contracts/accept-ledger.command';

@CommandHandler(AcceptLedgerCommand)
export class AcceptLedgerHandler implements ICommandHandler<AcceptLedgerCommand> {
  constructor(private readonly debtsLedgerRepository: DebtsLedgerRepository) {}

  async execute(command: AcceptLedgerCommand): Promise<any> {
    const debtsLedger = await this.debtsLedgerRepository.find(command.threadId);
    if (!debtsLedger) {
      throw new Error(`Error when accepting ledger for thread ${command.threadId} by user ${command.userId}. Ledger doesn't exists`);
    }

    debtsLedger.accept(command);

    await this.debtsLedgerRepository.save(debtsLedger);
  }
}
