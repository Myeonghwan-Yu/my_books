import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ProductImagesService } from './productImages.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class ProductImagesResolver {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Mutation(() => [String])
  async uploadProductImages(
    @Args('productId') productId: string,
    @Args({ name: 'productImages', type: () => [GraphQLUpload] })
    productImages: FileUpload[],
  ): Promise<string[]> {
    return await this.productImagesService.upload({
      productId,
      productImages,
    });
  }
}
