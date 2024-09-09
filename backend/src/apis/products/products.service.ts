import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entites/product.entity';
import { Repository } from 'typeorm';
import { IProductsCreateServiceCreate } from './interfaces/products-service.interface';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create({
    createProductInput,
  }: IProductsCreateServiceCreate): Promise<Product> {
    const result = await this.productRepository.save({
      ...createProductInput,
    });
    return result;
  }
}
