import { DebtType } from "../contracts/value-objects/debt-type";

export class Debt {
  constructor(
    private readonly type: DebtType,
    private readonly amount: number,
    private readonly comment: string,
    private readonly date: Date) {}

  getType(): DebtType {
    return this.type;
  }

  getAmount(): number {
    return this.amount;
  }

  getComment(): string {
    return this.comment;
  }

  getDate(): Date {
    return this.date;
  }
}
