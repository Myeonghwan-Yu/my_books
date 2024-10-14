import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { productImagesService } from './productImages.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class productImagesResolver {
  constructor(
    private readonly productImagesService: productImagesService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ): Promise<string[]> {
    return this.productImagesService.upload({ files });
  }
}
