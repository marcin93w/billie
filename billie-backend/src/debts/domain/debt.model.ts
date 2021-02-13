import { DebtSchema } from "src/common/database.schema";
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

  static createFrom(dbModel: DebtSchema): Debt {
    return new Debt(dbModel.type, dbModel.amount, dbModel.comment, new Date(dbModel.date));
  }

  export(): DebtSchema {
    return ({
      amount: this.amount,
      comment: this.comment,
      date: this.date,
      type: this.type
    })
  }
}
