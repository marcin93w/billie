import { AggregateRoot } from '@nestjs/cqrs';
import { Debt, DebtType } from './debt.model';
import { AddDebtCommand } from './add-debt.command';

// Represents ledger that holds all debts between 2 users.
// Ledger is identified by threadId.
// User who initiated the ledger by sending first debt is called host.
export class DebtsLedger extends AggregateRoot {
  public readonly debts: Debt[];
  public balance = 0;

  constructor(
    private readonly threadId: string,
    private readonly hostUserId: string,
  ) {
    super();
    this.debts = new Array();
  }

  addDebt(command: AddDebtCommand) {
    let debt = command.debt;
    if (command.userId !== this.hostUserId) {
      debt = this.createReversedDebt(command.debt);
    }

    this.debts.push(debt);
    if (debt.type === DebtType.BORROWED || debt.type === DebtType.LENT_PAYOFF) {
      this.balance -= debt.amount;
    } else {
      this.balance += debt.amount;
    }
  }

  private createReversedDebt(debt: Debt) {
    let reversedDebtType: DebtType;

    switch (debt.type) {
      case DebtType.BORROWED:
        reversedDebtType = DebtType.LENT;
        break;
      case DebtType.BORROWED_PAYOFF:
        reversedDebtType = DebtType.LENT_PAYOFF;
        break;
      case DebtType.LENT:
        reversedDebtType = DebtType.BORROWED;
        break;
      case DebtType.LENT_PAYOFF:
        reversedDebtType = DebtType.BORROWED_PAYOFF;
        break;
    }

    return new Debt(reversedDebtType, debt.amount, debt.comment, debt.date);
  }
}
