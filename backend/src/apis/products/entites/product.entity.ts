import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  serial: string;

  @Column()
  price: number;

  @Column()
  category: string;

  @Column()
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isBook: boolean;

  @Column({ nullable: true })
  author?: string;

  @Column({ nullable: true })
  publisher?: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ nullable: true })
  isbn?: string;

  @Column({ nullable: true })
  pages?: number;

  @Column({ nullable: true })
  genre?: string;
}
