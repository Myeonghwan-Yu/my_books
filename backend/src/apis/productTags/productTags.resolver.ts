import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'; // 필요한 데코레이터 임포트
import { ProductTag } from './entities/productTag.entity';
import { ProductTagsService } from './productTags.service';
import {
  CreateProductTagInput,
  UpdateProductTagInput,
} from './dto/create-productTag.input';
import { Product } from '../products/entities/product.entity';

@Resolver()
export class ProductTagsResolver {
  constructor(
    private readonly productTagsService: ProductTagsService, //
  ) {}

  @Mutation(() => ProductTag)
  async createProductTag(
    @Args('createProductTagInput') createProductTagInput: CreateProductTagInput, // @Args 데코레이터 추가
  ): Promise<ProductTag> {
    const result = this.productTagsService.create({ createProductTagInput });

    return result;
  }

  @Query(() => ProductTag)
  async fetchProductTag(@Args('productTagId') productTagId: string) {
    return this.productTagsService.findOne({ productTagId });
  }

  @Query(() => [ProductTag])
  async fetchProductTags() {
    return this.productTagsService.findAll();
  }

  @Mutation(() => ProductTag)
  async updateProductTag(
    @Args('producTagId') productTagId: string,
    @Args('updateProductTagInput') updateProductTagInput: UpdateProductTagInput,
  ): Promise<ProductTag> {
    return this.productTagsService.update({
      productTagId,
      updateProductTagInput,
    });
  }

  @Mutation(() => Boolean)
  async deleteProductTag(
    @Args('productTagId') productTagId: string,
  ): Promise<boolean> {
    return this.productTagsService.delete({ productTagId });
  }

  @Query(() => [Product])
  async fetchProductsByTag(
    @Args('productTagId') productTagId: string,
  ): Promise<Product[]> {
    return this.productTagsService.findProductsByTag(productTagId);
  }
}
