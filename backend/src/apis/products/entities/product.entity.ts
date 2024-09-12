import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { BookProduct } from 'src/apis/bookproducts/entitites/bookproduct.entity';
import { Review } from 'src/apis/reivews/entities/review.entity';

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

  @Min(0)
  @Field(() => Int)
  @Column()
  price: number;

  @Min(0)
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
  @OneToOne(() => BookProduct, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bookProduct?: BookProduct;

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.product)
  reviews?: Review[];
}
