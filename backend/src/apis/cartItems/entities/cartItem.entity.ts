import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Cart } from 'src/apis/carts/entities/cart.entity';
import { Product } from 'src/apis/products/entities/product.entity';

@ObjectType()
@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @Field(() => Cart)
  cart: Cart;

  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Product;

  @Column()
  @Field(() => Int)
  quantity: number;
}
