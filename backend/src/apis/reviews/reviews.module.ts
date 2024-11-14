import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([
      Review, //
    ]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
    ProductsService,
    UsersService,
  ],
})
export class ReviewsModule {}
