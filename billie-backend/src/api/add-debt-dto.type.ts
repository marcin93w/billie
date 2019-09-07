import { DebtType } from '../debts/contracts/debt.model';

export interface AddDebtDto {
  type: DebtType;
  amount: number | string;
  comment: string;
}
