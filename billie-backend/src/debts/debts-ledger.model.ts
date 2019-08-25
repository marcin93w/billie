import { AggregateRoot } from '@nestjs/cqrs';
import { Debt, DebtType } from './contracts/debt.model';
import { AddDebtCommand } from './contracts/add-debt.command';

// Represents ledger that holds all debts between 2 users.
// Ledger is identified by threadId.
// User who initiated the ledger by sending first debt is called host.
export class DebtsLedger extends AggregateRoot {
  private debts: Debt[];
  private balance = 0;

  constructor(
    private readonly threadId: string,
    private readonly hostUserId: string,
  ) {
    super();
    this.debts = new Array();
  }

  public getThreadId(): string {
    return this.threadId;
  }

  public getDebts(): Debt[] {
    return this.debts;
  }

  public getBalance(): number {
    return this.balance;
  }

  addDebt(command: AddDebtCommand) {
    let debt = command.debt;
    if (command.userId !== this.hostUserId) {
      debt = this.createReversedDebt(command.debt);
    }

    this.debts.push(debt);
    if (debt.getType() === DebtType.BORROWED || debt.getType() === DebtType.LENT_PAYOFF) {
      this.balance -= debt.getAmount();
    } else {
      this.balance += debt.getAmount();
    }
  }

  private createReversedDebt(debt: Debt) {
    let reversedDebtType: DebtType;

    switch (debt.getType()) {
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

    return new Debt(reversedDebtType, debt.getAmount(), debt.getComment(), debt.getDate());
  }

  static deserialize(jsonData: any): DebtsLedger {
    const ledger = new DebtsLedger(jsonData.threadId, jsonData.hostUserId);

    Object.assign(ledger, jsonData);
    if (jsonData.debts) {
      ledger.debts = jsonData.debts.map(d => Object.assign(Object.create(Debt.prototype), { ...d, date: new Date(d.date)}));
    }

    return ledger;
  }
}
