import { Resolver, Mutation, Args } from '@nestjs/graphql'; // 필요한 데코레이터 임포트
import { ProductTag } from './entities/productTag.entity';
import { ProductsTagsService } from './productsTags.service';
import { CreateProductTagInput } from './dto/create-productTag.input';

@Resolver()
export class ProductsTagsResolver {
  constructor(
    private readonly productsTagsService: ProductsTagsService, //
  ) {}

  @Mutation(() => ProductTag) // GraphQL Mutation 정의
  async createProductTag(
    @Args('createProductTagInput') createProductTagInput: CreateProductTagInput, // @Args 데코레이터 추가
  ): Promise<ProductTag> {
    const result = this.productsTagsService.create({ createProductTagInput });

    return result;
  }
}
