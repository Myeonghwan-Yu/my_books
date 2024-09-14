import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from 'src/apis/products/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
@ObjectType()
export class ProductTag {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  // N대M 관계 설정 (역방향)
  @ManyToMany(() => Product, (product) => product.productTags)
  @Field(() => [Product]) // GraphQL에서 제품들을 조회할 수 있게 함
  products: Product[];
}
