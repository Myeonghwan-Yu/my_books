import { Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly usersService: ProductsService, //
  ) {}

  @Query(() => String)
  getHello(): string {
    return this.usersService.getHello();
  }
}
