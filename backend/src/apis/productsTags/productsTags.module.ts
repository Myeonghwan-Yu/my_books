import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/productTag.entity';
import { ProductsTagsResolver } from './productsTags.resolver';
import { ProductsTagsService } from './productsTags.service';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([
      ProductTag, //
    ]),
  ],
  providers: [
    ProductsTagsResolver, //
    ProductsTagsService,
  ],
})
export class ReviewsModule {}
