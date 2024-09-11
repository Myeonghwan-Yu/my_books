import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsInt, Min } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  stock?: number;
}
