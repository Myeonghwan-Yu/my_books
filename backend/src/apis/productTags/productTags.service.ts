import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTag } from './entities/productTag.entity';
import {
  IProductTagsServiceCreate,
  IProductTagsServiceDelete,
  IProductTagsServiceFindOne,
  IProductTagsServiceFindProductsByTag,
  IProductTagsServiceUpdate,
} from './interfaces/productTags-service.interface';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productTagsRepository: Repository<ProductTag>, //
  ) {}

  async create({
    createProductTagInput,
  }: IProductTagsServiceCreate): Promise<ProductTag> {
    const result = this.productTagsRepository.create({
      ...createProductTagInput,
    });
    return this.productTagsRepository.save(result);
  }

  async findOne({
    productTagId,
  }: IProductTagsServiceFindOne): Promise<ProductTag> {
    return this.productTagsRepository.findOne({ where: { id: productTagId } });
  }

  async findAll(): Promise<ProductTag[]> {
    return this.productTagsRepository.find();
  }

  async update({
    productTagId,
    updateProductTagInput,
  }: IProductTagsServiceUpdate): Promise<ProductTag> {
    const productTag = await this.findOne({ productTagId });

    if (!productTagId) {
      throw new NotFoundException('태그를 찾을 수 없습니다.');
    }

    const result = await this.productTagsRepository.save({
      ...productTag,
      ...updateProductTagInput,
    });

    return result;
  }

  async delete({ productTagId }: IProductTagsServiceDelete): Promise<boolean> {
    const productTag = await this.findOne({ productTagId });

    if (!productTag) {
      throw new NotFoundException('태그를 찾을 수 없습니다.');
    }

    await this.productTagsRepository.delete({ id: productTagId });
    return true;
  }

  async findProductsByTag({
    productTagId,
  }: IProductTagsServiceFindProductsByTag): Promise<Product[]> {
    const productTag = await this.findOne({ productTagId });

    if (!productTag) {
      throw new NotFoundException('태그를 찾을 수 없습니다');
    }

    return productTag.products;
  }
}
