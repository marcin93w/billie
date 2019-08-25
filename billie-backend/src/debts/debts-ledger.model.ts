import { AggregateRoot } from '@nestjs/cqrs';
import { Debt, DebtType } from './contracts/debt.model';
import { AddDebtCommand } from './contracts/add-debt.command';
import { AcceptLedgerCommand } from './contracts/accept-ledger.command';
import { DebtsLedgerSchema } from '../common/database.schema';

// Represents ledger that holds all debts between 2 users.
// Ledger is identified by threadId.
// User who initiated the ledger by sending first debt is called host,
// user who was receiver of first debt is called guest.
export class DebtsLedger extends AggregateRoot {
  private debts: Debt[];
  private balance = 0;
  private guestUserId: string;

  constructor(
    private readonly threadId: string,
    private readonly hostUserId: string,
  ) {
    super();
    this.debts = new Array();
  }

  getThreadId(): string {
    return this.threadId;
  }

  getDebts(): Debt[] {
    return this.debts;
  }

  getBalance(): number {
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

  accept(command: AcceptLedgerCommand) {
    if (command.userId === this.hostUserId) {
      throw new Error('Host and guest of the ledger cannot be the same user.');
    }

    this.guestUserId = command.userId;
  }

  static createFrom(dbModel: DebtsLedgerSchema): DebtsLedger {
    const ledger = new DebtsLedger(dbModel.threadId, dbModel.hostUserId);

    Object.assign(ledger, dbModel);
    if (dbModel.debts) {
      ledger.debts = dbModel.debts.map(d => Object.assign(Object.create(Debt.prototype), { ...d, date: new Date(d.date)}));
    }

    return ledger;
  }
}
