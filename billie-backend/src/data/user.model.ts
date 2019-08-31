import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserSchema {
  @Field() id: string;
  @Field() name: string;
  @Field() fullName: string;
  @Field() gender: string;
  @Field() avatarUrl: string;
}
