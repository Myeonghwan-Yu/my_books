import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ProductsModule, //
    UsersModule,
    TypeOrmModule.forFeature([Review]),
  ],
  providers: [
    ReviewsResolver, //
    ReviewsService,
  ],
})
export class ReviewsModule {}
