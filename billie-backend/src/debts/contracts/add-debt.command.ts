import { Debt } from './debt.model';

export class AddDebtCommand {
  constructor(
    public readonly userId: string,
    public readonly threadId: string,
    public readonly debt: Debt,
  ) {}
}
