import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field(() => String)
  productId: string;

  @Field(() => Int)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderItemInput])
  orderItems: OrderItemInput[];
}
