import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@ObjectType() // GraphQL 타입으로 정의
@Entity()
export class BookProduct {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Product) // Product 엔티티와의 관계 정의
  @OneToOne(() => Product, (product) => product.bookProduct)
  @JoinColumn()
  product: Product;

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
