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
import { BookProductsService } from '../bookproducts/bookProducts.service';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly bookProductService: BookProductsService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['bookProduct'],
    });
  }

  async findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['bookProduct'],
    });
  }

  async create({
    createProductInput,
  }: IProductsCreateServiceCreate): Promise<Product> {
    const { bookProduct, ...product } = createProductInput;

    const result = await this.bookProductService.create({
      ...bookProduct,
    });

    const result2 = await this.productsRepository.save({
      ...product,
      bookProduct: result,
    });

    return result2;
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
    const product = await this.findOne({ productId });

    if (product) {
      if (product.bookProduct) {
        const result = await this.bookProductService.delete({
          id: product.bookProduct.id,
        });

        if (!result) {
          return false;
        }
      }
      const result2 = await this.productsRepository.delete({ id: productId });
      return result2.affected ? true : false;
    }

    return false;
  }
}
