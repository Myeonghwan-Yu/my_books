import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTag } from './entities/productTag.entity';
import { IProductsTagsServiceCreate } from './interfaces/productsTags-service.interface';

@Injectable()
export class ProductsTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productTagRepository: Repository<ProductTag>, //
  ) {}

  async create({
    createProductTagInput,
  }: IProductsTagsServiceCreate): Promise<ProductTag> {
    const result = this.productTagRepository.create({
      ...createProductTagInput,
    });
    return this.productTagRepository.save(result);
  }
}
