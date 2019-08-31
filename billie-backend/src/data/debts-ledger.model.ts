import { Field, ObjectType } from 'type-graphql';
import { DebtSchema } from './debt.model';

@ObjectType()
export class DebtsLedgerSchema {
  @Field() threadId: string;
  @Field() balance: number;
  @Field(type => [DebtSchema]) debts: DebtSchema[];
  @Field() hostUserId: string;
  @Field({ nullable: true }) guestUserId?: string;
}
