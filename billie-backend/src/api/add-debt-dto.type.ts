import { DebtType } from '../debts/contracts/debt.model';

export interface AddDebtDto {
  debtType: DebtType;
  amount: number;
  comment: string;
}
