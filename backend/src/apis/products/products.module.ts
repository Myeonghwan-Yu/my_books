import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Product } from './entities/product.entity';
import { BookProduct } from '../bookProducts/entitites/bookproduct.entity';
import { BookProductsService } from '../bookProducts/bookProducts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      BookProduct, //
    ]),
  ],
  providers: [
    ProductsResolver, //
    ProductsService,
    BookProductsService,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
