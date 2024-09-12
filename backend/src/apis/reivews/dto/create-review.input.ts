import { InputType, Field, Int } from '@nestjs/graphql';
import { Min, Max, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateReviewInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => Int)
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  rating: number;
}
