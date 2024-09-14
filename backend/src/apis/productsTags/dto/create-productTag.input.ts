import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProductTagInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;
}
