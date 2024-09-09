import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BookProduct } from 'src/apis/bookproducts/entities/bookProduct.entity';

@ObjectType() // GraphQL 타입으로 정의
@Entity()
export class Product {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field(() => Int)
  @Column({ default: 0 })
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

  @Field(() => BookProduct, { nullable: true })
  @OneToOne(() => BookProduct, { nullable: true })
  @JoinColumn()
  bookProduct?: BookProduct;
}
