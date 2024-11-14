import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Min, Max } from 'class-validator';
import { Product } from 'src/apis/products/entities/product.entity';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
@Entity()
export class Review {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  content: string;

  @Field(() => Int)
  @Column()
  @Min(0)
  @Max(5)
  rating: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
