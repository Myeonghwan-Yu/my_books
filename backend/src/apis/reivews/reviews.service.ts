import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductsService } from '../products/products.service';
import {
  IReivewServiceFindOne,
  IReviewServiceDelete,
  IReviewServiceFindAll,
  IReviewsServiceCreate,
  IReviewsServiceUpdate,
} from './interfaces/reviews-service.interface';

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

  async findOne({ reviewId }: IReivewServiceFindOne): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }

    return review;
  }

  async findAll({ productId }: IReviewServiceFindAll): Promise<Review[]> {
    return await this.reviewsRepository.find({
      where: { product: { id: productId } },
    });
  }

  async delete({ reviewId }: IReviewServiceDelete): Promise<boolean> {
    const review = await this.findOne({ reviewId });

    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }
    await this.reviewsRepository.delete({ id: reviewId });
    return true;
  }

  async update({
    reviewId,
    updateReviewInput,
  }: IReviewsServiceUpdate): Promise<Review> {
    const review = await this.findOne({ reviewId });

    if (!review) {
      throw new NotFoundException('리뷰를 찾을 수 없습니다.');
    }

    const result = await this.reviewsRepository.save({
      ...review,
      ...updateReviewInput,
    });

    return result;
  }
}
