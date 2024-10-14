import { Field, ObjectType } from '@nestjs/graphql';
import { OrderItem } from 'src/apis/orderItems/entities/orderItem.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@ObjectType()
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'int' })
  @Field(() => Number)
  orderTotalPrice: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  @Field(() => String)
  paymentStatus: PaymentStatus;

  @ManyToOne(() => User, (user) => user.orders)
  @Field(() => User)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  @Field(() => [OrderItem])
  orderItems: OrderItem[];
}
