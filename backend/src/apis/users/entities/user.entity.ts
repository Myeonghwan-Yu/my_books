import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne, // OneToOne 데코레이터 추가
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from 'src/apis/carts/entities/cart.entity'; // Cart 엔티티 import

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column() // DB에 저장, GQL에 노출하지 않음.
  password: string;

  @Column()
  @Field(() => Int)
  age: number;

  @Column({ default: false })
  @Field(() => Boolean)
  isSeller: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @OneToOne(() => Cart, (cart) => cart.user) // Cart와 1:1 관계 정의
  @Field(() => Cart, { nullable: true }) // GraphQL에 노출
  cart: Cart;
}
