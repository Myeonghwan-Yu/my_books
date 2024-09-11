import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from './product.entity';

@ObjectType() // GraphQL 타입으로 정의
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

  @Field(() => Product) // 관계 설정
  @OneToOne(() => Product, (product) => product.bookProduct)
  @JoinColumn()
  product: Product;
}
