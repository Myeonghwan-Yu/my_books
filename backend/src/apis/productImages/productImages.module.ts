import { Module } from '@nestjs/common';
import { productImagesService } from './productImags.service';
import { productImagesResolver } from './productImages.resovler';

@Module({
  providers: [
    productImagesResolver, //
    productImagesService,
  ],
})
export class ProductImagesModule {}
