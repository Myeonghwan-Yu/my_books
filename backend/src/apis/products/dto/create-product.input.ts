import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsDate,
  IsInt,
  ValidateIf,
} from 'class-validator';

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

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook)
  @IsString()
  author?: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook)
  @IsString()
  publisher?: string;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => o.isBook)
  @IsDate()
  publishedDate?: Date;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook)
  @IsString()
  isbn?: string;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.isBook)
  @IsInt()
  pages?: number;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook)
  @IsString()
  genre?: string;
}
