import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddProductToCartInput {
  @Field(() => String)
  productId: string;

  @Field(() => Int, { defaultValue: 1 })
  quantity: number;
}
