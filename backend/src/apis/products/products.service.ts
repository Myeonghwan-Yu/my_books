import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import {
  IProductServiceAddProductTag,
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
import { BookProductsService } from '../bookProducts/bookProducts.service';
import { ProductTagsService } from '../productTags/productTags.service';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly bookProductsService: BookProductsService,
    private readonly productTagsService: ProductTagsService,
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
    files,
  }: IProductsServiceCreate): Promise<Product> {
    const { bookProductInput, isBook, ...productData } = createProductInput;

    let bookProduct = null;

    if (isBook && bookProductInput) {
      bookProduct = await this.bookProductsService.create({
        bookProductInput,
      });
    }

    let productImages = [];
    if (files && files.length > 0) {
      productImages =
        await this.productImagesService.createProductImages(files);
    }

    const product = this.productsRepository.create({
      ...productData,
      bookProduct,
      productImages,
    });

    return this.productsRepository.save(product);
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
        const result = await this.bookProductsService.delete({
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

  async addProductTag({
    productId,
    productTagId,
  }: IProductServiceAddProductTag): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productTags'],
    });

    const productTag = await this.productTagsService.findOne({ productTagId });

    if (!product || !productTag) {
      throw new NotFoundException('상품이나 태그가 존재하지 않습니다');
    }

    if (product.productTags.some((tag) => tag.id === productTagId)) {
      throw new ConflictException('이미 추가된 태그입니다');
    }

    product.productTags.push(productTag);

    return this.productsRepository.save(product);
  }
}
