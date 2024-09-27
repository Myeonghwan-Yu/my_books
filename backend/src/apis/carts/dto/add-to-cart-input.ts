import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddToCartInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;
}
