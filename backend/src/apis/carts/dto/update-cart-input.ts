import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput {
  @Field(() => String)
  productId: string; // 수정할 상품의 ID

  @Field(() => Int)
  quantity: number; // 새로운 수량
}
