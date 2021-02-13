import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AcceptLedgerCommand } from '../contracts/accept-ledger.command';
import { DebtsLedgerRepository } from '../domain/debts-ledger.repository';

@CommandHandler(AcceptLedgerCommand)
export class AcceptLedgerHandler implements ICommandHandler<AcceptLedgerCommand> {
  constructor(private readonly debtsLedgerRepository: DebtsLedgerRepository) {}

  async execute(command: AcceptLedgerCommand): Promise<any> {
    const debtsLedger = await this.debtsLedgerRepository.find(command.threadId);
    if (!debtsLedger) {
      throw new Error(`Error when accepting ledger for thread ${command.threadId} by user ${command.userId}. Ledger doesn't exists`);
    }

    debtsLedger.accept(command.userId);

    await this.debtsLedgerRepository.save(debtsLedger);
  }
}
