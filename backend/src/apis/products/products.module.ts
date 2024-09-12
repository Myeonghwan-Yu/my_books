import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { Product } from './entities/product.entity';
import { BookProduct } from '../bookproducts/entitites/bookproduct.entity';
import { BookProductsService } from '../bookproducts/bookProducts.service';

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
})
export class ProductsModule {}
