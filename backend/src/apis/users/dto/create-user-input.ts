import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Max, Min } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => Int)
  @Min(0)
  @Max(200)
  age: number;
}
