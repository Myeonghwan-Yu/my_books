import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductTag } from './entities/productTag.entity';
import {
  IProductTagsServiceCreate,
  IProductTagsServiceDelete,
  IProductTagsServiceFindOneById,
  IProductTagsServiceFindOneByName,
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

  async findOneById({
    productTagId,
  }: IProductTagsServiceFindOneById): Promise<ProductTag> {
    return this.productTagsRepository.findOne({ where: { id: productTagId } });
  }

  async findOneByName({
    productTagName,
  }: IProductTagsServiceFindOneByName): Promise<ProductTag> {
    return this.productTagsRepository.findOne({
      where: { name: productTagName },
    });
  }

  async findAll(): Promise<ProductTag[]> {
    return this.productTagsRepository.find();
  }

  async create({
    createProductTagInput,
  }: IProductTagsServiceCreate): Promise<ProductTag> {
    const existingTag = await this.findOneByName({
      productTagName: createProductTagInput.name,
    });

    if (existingTag) {
      throw new ConflictException('이미 존재하는 태그입니다.');
    }

    const result = this.productTagsRepository.create({
      ...createProductTagInput,
    });

    return this.productTagsRepository.save(result);
  }

  async update({
    productTagId,
    updateProductTagInput,
  }: IProductTagsServiceUpdate): Promise<ProductTag> {
    const productTag = await this.findOneById({ productTagId });

    if (!productTag) {
      throw new NotFoundException('태그를 찾을 수 없습니다.');
    }

    const result = await this.productTagsRepository.save({
      ...productTag,
      ...updateProductTagInput,
    });

    return result;
  }

  async delete({ productTagId }: IProductTagsServiceDelete): Promise<boolean> {
    const productTag = await this.findOneById({ productTagId });

    if (!productTag) {
      throw new NotFoundException('해당 태그를 찾을 수 없습니다.');
    }

    const result = await this.productTagsRepository.delete({
      id: productTagId,
    });

    return result.affected > 0;
  }

  async findProductsByTag({
    productTagId,
  }: IProductTagsServiceFindProductsByTag): Promise<Product[]> {
    const productTag = await this.findOneById({ productTagId });

    if (!productTag) {
      throw new NotFoundException('태그를 찾을 수 없습니다');
    }

    return productTag.products;
  }
}
