import { Product } from 'src/apis/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class BookProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.bookProduct)
  @JoinColumn()
  product: Product;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column('date')
  publicationDate: Date;

  @Column()
  isbn: string;
}
