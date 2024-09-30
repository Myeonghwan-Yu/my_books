import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from 'src/apis/carts/entities/cart.entity';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

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

  @OneToOne(() => Cart, (cart) => cart.user, { onDelete: 'CASCADE' })
  @Field(() => Cart, { nullable: true })
  cart: Cart;
}
