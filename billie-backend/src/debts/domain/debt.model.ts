export enum DebtType {
  BORROWED,
  LENT,
  BORROWED_PAYOFF,
  LENT_PAYOFF,
}

export class Debt {
  constructor(
    public readonly type: DebtType,
    public readonly amount: number,
    public readonly comment: string,
    public readonly date: Date) {}
}
