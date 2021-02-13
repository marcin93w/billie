import { AggregateRoot } from '@nestjs/cqrs';
import { Debt } from './debt.model';
import { AddDebtCommand } from '../contracts/add-debt.command';
import { AcceptLedgerCommand } from '../contracts/accept-ledger.command';
import { DebtsLedgerSchema } from '../../common/database.schema';
import { AddDebtDto } from '../contracts/add-debt-dto.type';
import { DebtType } from '../contracts/value-objects/debt-type';

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

  addDebt(userId: string, type: DebtType, amount: number, comment: string): number {
    const debt = this.createDebt(userId, type, amount, comment);

    const debtId = this.debts.push(debt);
    if (debt.getType() === DebtType.BORROWED || debt.getType() === DebtType.LENT_PAYOFF) {
      this.balance -= debt.getAmount();
    } else {
      this.balance += debt.getAmount();
    }

    return debtId;
  }

  private createDebt(userId: string, type: DebtType, amount: number, comment: string) {
    return new Debt(userId === this.hostUserId ? type : this.getReversedDebtType(type),
      amount, comment, new Date())
  }

  private getReversedDebtType(debtType: DebtType) {
    switch (debtType) {
      case DebtType.BORROWED:
        return DebtType.LENT;
      case DebtType.BORROWED_PAYOFF:
        return DebtType.LENT_PAYOFF;
      case DebtType.LENT:
        return DebtType.BORROWED;
      case DebtType.LENT_PAYOFF:
        return DebtType.BORROWED_PAYOFF;
    }
  }

  accept(userId: string) {
    if (userId === this.hostUserId) {
      throw new Error('Host and guest of the ledger cannot be the same user.');
    }

    this.guestUserId = userId;
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
