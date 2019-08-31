import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class DebtSchema {
  @Field() type: number;
  @Field() amount: number;
  @Field() comment: string;
  @Field() date: string;
}
