import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { BookProduct } from 'src/apis/bookProducts/entities/bookproduct.entity';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { ProductTag } from 'src/apis/productTags/entities/productTag.entity';
import { ProductImage } from 'src/apis/productImages/entities/productImage.entity';
import { OrderItem } from 'src/apis/orderItems/entities/orderItem.entity';

@ObjectType()
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

  @Field(() => [ProductTag], { nullable: true })
  @ManyToMany(() => ProductTag, (productTag) => productTag.products)
  @JoinTable()
  productTags?: ProductTag[];

  @Field(() => [OrderItem], { nullable: true })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems?: OrderItem[];

  @Field(() => [ProductImage], { nullable: true })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productImages?: ProductImage[];
}
