import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class BookProduct {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  author: string;

  @Field(() => String)
  @Column()
  publisher: string;

  @Field(() => Date)
  @Column()
  publishedDate: Date;

  @Field(() => String)
  @Column()
  isbn: string;

  @Field(() => Int)
  @Column()
  pages: number;

  @Field(() => String)
  @Column()
  genre: string;
}
