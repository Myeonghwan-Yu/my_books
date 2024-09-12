import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

@InputType()
export class BookProductInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  author: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  publisher: string;

  @Field(() => Date)
  @IsDate()
  @IsNotEmpty()
  publishedDate: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  pages: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  genre: string;
}

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  price: number;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isBook: boolean;

  @Field(() => BookProductInput, { nullable: true })
  @ValidateIf((o) => o.isBook === true)
  bookProduct?: BookProductInput;
}
