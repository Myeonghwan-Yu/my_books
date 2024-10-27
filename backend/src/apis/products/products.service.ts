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
  IProductsServiceAddProductTag,
  IProductsServiceCheckSoldOut,
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';
import { BookProductsService } from '../bookProducts/bookProducts.service';
import { ProductTagsService } from '../productTags/productTags.service';
import { ProductImagesService } from '../productImages/productImages.service';

@Injectable({ scope: Scope.DEFAULT })
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly bookProductsService: BookProductsService,
    private readonly productImagesService: ProductImagesService,
    private readonly productTagsService: ProductTagsService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['bookProduct', 'productImages'],
    });
  }

  async findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['bookProduct', 'productImages'],
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const { bookProductInput, isBook, productImages, ...productData } =
      createProductInput;

    let bookProduct = null;

    if (isBook && bookProductInput) {
      bookProduct = await this.bookProductsService.create({
        bookProductInput,
      });
    }

    let uploadedImages = [];
    if (productImages && productImages.length > 0) {
      uploadedImages = await this.productImagesService.upload({
        productImages,
      });
    }

    const product = this.productsRepository.create({
      ...productData,
      bookProduct,
      productImages: uploadedImages,
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
      productImages: product.productImages,
    });

    return result;
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const product = await this.findOne({ productId });

    if (product) {
      if (product.bookProduct) {
        const result = await this.bookProductsService.delete({
          bookProductId: product.bookProduct.id,
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
  }: IProductsServiceAddProductTag): Promise<Product> {
    const product = await this.findOne({ productId });
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

  async checkSoldOut({
    productId,
    quantity,
  }: IProductsServiceCheckSoldOut): Promise<Product> {
    const product = await this.findOne({ productId });

    if (!product) {
      throw new NotFoundException('상품이 존재하지 않습니다.');
    }

    if (quantity > product.stock) {
      throw new Error(`${product.name}의 재고가 부족합니다.`);
    }

    return product;
  }
}
