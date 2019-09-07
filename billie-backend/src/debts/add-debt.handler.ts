import { AddDebtCommand } from './contracts/add-debt.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebtsLedgerRepository } from './debts-ledger.repository';
import { DebtsLedger } from './debts-ledger.model';
import { DebtType } from './contracts/debt.model';

@CommandHandler(AddDebtCommand)
export class AddDebtHandler implements ICommandHandler<AddDebtCommand> {
  constructor(private readonly debtsLedgerRepository: DebtsLedgerRepository) {}

  async execute(command: AddDebtCommand): Promise<any> {
    if (!command.userId || !command.threadId || !command.debt) {
      throw new Error('All parameters for AddDebtCommand must be provided');
    }
    if (!(command.debt.getType() in DebtType)) {
      throw new Error('Debt type invalid');
    }
    if (command.debt.getDate().valueOf() === 0) {
      throw new Error('Debt date invalid');
    }
    if (command.debt.getAmount() < 0) {
      throw new Error('Debt amount invalid');
    }

    const debtsLedger = (await this.debtsLedgerRepository.find(command.threadId)) ||
      new DebtsLedger(command.threadId, command.userId);

    debtsLedger.addDebt(command);

    await this.debtsLedgerRepository.save(debtsLedger);
  }
}
