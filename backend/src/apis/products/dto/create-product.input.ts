import { Field, InputType, Int, Float } from '@nestjs/graphql';
import {
  IsBoolean,
  IsString,
  IsNotEmpty,
  IsDate,
  IsInt,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

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

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  serial: string;

  @Field(() => Float)
  @IsInt()
  @IsNotEmpty()
  price: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isBook: boolean;

  // 책인 경우 필수로 지정, 그렇지 않으면 null로 처리
  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook === true)
  @IsString()
  @IsNotEmpty()
  @Transform(({ obj }) => (obj.isBook ? obj.author : null))
  author?: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook === true)
  @IsString()
  @IsNotEmpty()
  @Transform(({ obj }) => (obj.isBook ? obj.publisher : null))
  publisher?: string;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => o.isBook === true)
  @IsDate()
  @IsNotEmpty()
  @Transform(({ obj }) => (obj.isBook ? obj.publishedDate : null))
  publishedDate?: Date;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook === true)
  @IsString()
  @IsNotEmpty()
  @Transform(({ obj }) => (obj.isBook ? obj.isbn : null))
  isbn?: string;

  @Field(() => Int, { nullable: true })
  @ValidateIf((o) => o.isBook === true)
  @IsInt()
  @IsNotEmpty()
  @Transform(({ obj }) => (obj.isBook ? obj.pages : null))
  pages?: number;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.isBook === true)
  @IsString()
  @IsNotEmpty()
  @Transform(({ obj }) => (obj.isBook ? obj.genre : null))
  genre?: string;
}
