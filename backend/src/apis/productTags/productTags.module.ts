import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTag } from './entities/productTag.entity';
import { ProductTagsResolver } from './productTags.resolver';
import { ProductTagsService } from './productTags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductTag, //
    ]),
  ],

  providers: [
    ProductTagsResolver, //
    ProductTagsService,
  ],

  exports: [ProductTagsService],
})
export class ProductTagsModule {}
