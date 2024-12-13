import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from 'src/apis/orders/entities/order.entity';
import { Product } from 'src/apis/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  @Field(() => String)
  id: string;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @Field(() => Order)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @Field(() => Product)
  product: Product;

  @Column({ type: 'int' })
  @Field(() => Number)
  quantity: number;

  @Column({ type: 'int' })
  @Field(() => Number)
  itemTotalPrice: number;
}
