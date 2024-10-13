import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput {
  @Field(() => String)
  productId: string;

  @Field(() => Int)
  quantity: number;
}
