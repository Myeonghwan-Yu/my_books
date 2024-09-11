import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import {
  IProductsCreateServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({ where: { id: productId } });
  }

  async create({
    createProductInput,
  }: IProductsCreateServiceCreate): Promise<Product> {
    const result = await this.productsRepository.save({
      ...createProductInput,
    });
    return result;
  }

  async update({
    productId,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const product = await this.findOne({ productId });

    const result = await this.productsRepository.save({
      ...product,
      ...updateProductInput,
    });

    return result;
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.delete({ id: productId });
    return result.affected ? true : false;
  }
}
