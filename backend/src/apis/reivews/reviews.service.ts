import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductsService } from '../products/products.service';
import { IReviewsServiceCreate } from './interfaces/reviews-service.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productsService: ProductsService,
  ) {}

  async create({
    productId,
    createReviewInput,
  }: IReviewsServiceCreate): Promise<Review> {
    const product = await this.productsService.findOne({ productId });

    if (!product) {
      throw new Error('Product not found');
    }
    const review = this.reviewsRepository.create({
      ...createReviewInput,
      product,
    });

    return this.reviewsRepository.save(review);
  }
}
