import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/productTag.entity';
import { ProductTagsResolver } from './productTags.resolver';
import { ProductTagsService } from './productTags.service';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([
      ProductTag, //
    ]),
  ],
  providers: [
    ProductTagsResolver, //
    ProductTagsService,
  ],
})
export class ProductTagsModule {}
