import { AddDebtCommand } from '../contracts/add-debt.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DebtsLedgerRepository } from '../domain/debts-ledger.repository';
import { DebtType } from '../contracts/value-objects/debt-type';
import { DebtsLedger } from '../domain/debts-ledger.model';

@CommandHandler(AddDebtCommand)
export class AddDebtHandler implements ICommandHandler<AddDebtCommand> {
  constructor(private readonly debtsLedgerRepository: DebtsLedgerRepository) {}

  async execute(command: AddDebtCommand): Promise<any> {
    const { userId, threadId, debt } = command;

    if (!userId || !threadId || !debt) {
      throw new Error('All parameters for AddDebtCommand must be provided');
    }
    if (!(debt.type in DebtType)) {
      throw new Error('Debt type invalid');
    }
    if (command.debt.amount < 0) {
      throw new Error('Debt amount invalid');
    }

    const debtsLedger = (await this.debtsLedgerRepository.find(threadId)) ||
      new DebtsLedger(threadId, userId);

    const debtId = debtsLedger.addDebt(userId, debt.type, Number(debt.amount), debt.comment);

    await this.debtsLedgerRepository.save(debtsLedger);

    return {
      debtId
    };
  }
}
