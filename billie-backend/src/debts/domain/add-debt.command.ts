import { Debt } from './debt.model';

export class AddDebtCommand {
  constructor(
    public readonly senderUserId: string,
    public readonly receiverUserId: string,
    public readonly debt: Debt,
  ) {}
}
