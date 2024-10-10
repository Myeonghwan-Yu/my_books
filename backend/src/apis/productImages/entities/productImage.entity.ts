import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ProductImage {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  imageUrl: string; // 이미지 URL 추가

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.productImages)
  product: Product;
}
