import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => Int, { nullable: true })
  rating?: number;
}
