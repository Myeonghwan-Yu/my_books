import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'; // 필요한 데코레이터 임포트
import { ProductTag } from './entities/productTag.entity';
import { ProductTagsService } from './productTags.service';
import { CreateProductTagInput } from './dto/create-productTag.input';
import { Product } from '../products/entities/product.entity';
import { UpdateProductTagInput } from './dto/update-productTag.input';

@Resolver()
export class ProductTagsResolver {
  constructor(
    private readonly productTagsService: ProductTagsService, //
  ) {}

  @Query(() => ProductTag)
  async fetchProductTagById(@Args('productTagId') productTagId: string) {
    return this.productTagsService.findOneById({ productTagId });
  }

  @Query(() => [ProductTag])
  async fetchProductTags() {
    return this.productTagsService.findAll();
  }

  @Mutation(() => ProductTag)
  async createProductTag(
    @Args('createProductTagInput') createProductTagInput: CreateProductTagInput,
  ): Promise<ProductTag> {
    const result = this.productTagsService.create({ createProductTagInput });

    return result;
  }

  @Mutation(() => ProductTag)
  async updateProductTag(
    @Args('productTagId') productTagId: string,
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
    return this.productTagsService.findProductsByTag({ productTagId });
  }
}
