import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entites/product.entity';
import { CreateProductInput } from './dto/create-product.input';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }
}
