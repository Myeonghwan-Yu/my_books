import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImage } from './entities/productImage.entity';
import { ProductsModule } from '../products/products.module';
import { ProductImagesService } from './productImages.service';
import { ProductImagesResolver } from './productImages.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductImage]), //
    ProductsModule,
  ],

  providers: [
    ProductImagesService, //
    ProductImagesResolver,
  ],

  exports: [ProductImagesService],
})
export class ProductImagesModule {}
