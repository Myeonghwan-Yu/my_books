import { Module } from '@nestjs/common';
import { productImagesService } from './productImages.service';
import { productImagesResolver } from './productImages.resovler';

@Module({
  providers: [
    productImagesResolver, //
    productImagesService,
  ],
})
export class ProductImagesModule {}
