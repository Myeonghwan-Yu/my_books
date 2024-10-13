import { Field, ObjectType } from '@nestjs/graphql';
import { CartItem } from 'src/apis/cartItems/entities/cartitem.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  @Field(() => User)
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  @Field(() => [CartItem])
  cartItems: CartItem[];
}
