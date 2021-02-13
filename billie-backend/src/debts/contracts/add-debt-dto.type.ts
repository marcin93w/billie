import { DebtType } from "./value-objects/debt-type";

export interface AddDebtDto {
  type: DebtType;
  amount: number | string;
  comment: string;
}
