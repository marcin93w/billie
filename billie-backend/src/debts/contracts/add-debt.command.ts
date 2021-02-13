import { AddDebtDto } from 'src/debts/contracts/add-debt-dto.type';

export class AddDebtCommand {
  constructor(
    public readonly userId: string,
    public readonly threadId: string,
    public readonly debt: AddDebtDto,
  ) {}
}
