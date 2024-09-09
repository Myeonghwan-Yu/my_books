import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

// 조건부분 더추가하자...

@ObjectType() // GraphQL 타입으로 정의
@Entity()
export class Product {
  @Field(() => Int) // GraphQL 필드 정의
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @Column()
  serial: string;

  @Field(() => Float)
  @Column()
  price: number;

  @Field(() => String)
  @Column()
  category: string;

  @Field(() => Int)
  @Column()
  stock: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  isBook: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  author?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  publisher?: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  isbn?: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  pages?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  genre?: string;
}
