import {
  BadRequestException,
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
    const { bookProductInput, isBook, ...productData } = createProductInput;

    let bookProduct = null;

    if (isBook && bookProductInput) {
      const existingBook = await this.bookProductsService.findOne({
        isbn: bookProductInput.isbn,
      });

      if (existingBook) {
        throw new ConflictException('이미 존재하는 ISBN입니다.');
      }

      bookProduct = await this.bookProductsService.create({ bookProductInput });
    }

    const product = this.productsRepository.create({
      ...productData,
      bookProduct,
    });

    return this.productsRepository.save(product);
  }

  async update({
    productId,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const product = await this.findOne({ productId });

    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    const updatedProduct = {
      ...product,
      ...updateProductInput,
    };

    const result = await this.productsRepository.save(updatedProduct);

    return result;
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const product = await this.findOne({ productId });

    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }

    if (product.productImages && product.productImages.length > 0) {
      throw new BadRequestException('이미지를 먼저 삭제해주세요.');
    }

    if (product.bookProduct) {
      const result = await this.bookProductsService.delete({
        bookProductId: product.bookProduct.id,
      });
      if (!result) {
        throw new NotFoundException('책 정보를 삭제하는 데 실패했습니다.');
      }
    }

    const result = await this.productsRepository.delete({ id: productId });

    return result.affected > 0;
  }

  async addProductTag({
    productId,
    productTagId,
  }: IProductsServiceAddProductTag): Promise<Product> {
    const product = await this.findOne({ productId });
    const productTag = await this.productTagsService.findOneById({
      productTagId,
    });

    if (!product || !productTag) {
      throw new NotFoundException('상품이나 태그가 존재하지 않습니다');
    }

    if (product.productTags.some((tag) => tag.id === productTagId)) {
      throw new ConflictException('이미 상품에 추가된 태그입니다');
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
