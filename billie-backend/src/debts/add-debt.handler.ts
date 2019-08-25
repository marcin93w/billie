import { AddDebtCommand } from './contracts/add-debt.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebtsLedgerRepository } from './debts-ledger.repository';
import { DebtsLedger } from './debts-ledger.model';

@CommandHandler(AddDebtCommand)
export class AddDebtHandler implements ICommandHandler<AddDebtCommand> {
  constructor(private readonly debtsLedgerRepository: DebtsLedgerRepository) {}

  async execute(command: AddDebtCommand): Promise<any> {
    const debtsLedger = (await this.debtsLedgerRepository.find(command.threadId)) ||
      new DebtsLedger(command.threadId, command.userId);

    debtsLedger.addDebt(command);

    await this.debtsLedgerRepository.save(debtsLedger);
  }
}
