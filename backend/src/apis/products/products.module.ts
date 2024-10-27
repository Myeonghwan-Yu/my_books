import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Product } from './entities/product.entity';
import { BookProductsService } from '../bookProducts/bookProducts.service';
import { ProductTagsModule } from '../productTags/productTags.module';
import { BookProduct } from '../bookProducts/entitites/bookproduct.entity';
import { ProductImagesService } from '../productImages/productImages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      BookProduct,
    ]),
    ProductTagsModule,
  ],

  providers: [
    ProductsResolver, //
    ProductsService,
    BookProductsService,
    ProductImagesService,
  ],

  exports: [ProductsService],
})
export class ProductsModule {}
