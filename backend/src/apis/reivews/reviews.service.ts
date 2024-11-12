import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductsService } from '../products/products.service';
import {
  IReviewsServiceCreate,
  IReviewsServiceDelete,
  IReviewsServiceFindAll,
  IReviewsServiceFindOne,
  IReviewsServiceUpdate,
} from './interfaces/reviews-service.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productsService: ProductsService,
  ) {}

  async findOne({ reviewId }: IReviewsServiceFindOne): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }

    return review;
  }

  async findAll({ productId }: IReviewsServiceFindAll): Promise<Review[]> {
    return await this.reviewsRepository.find({
      where: { product: { id: productId } },
    });
  }

  async create({
    productId,
    createReviewInput,
  }: IReviewsServiceCreate): Promise<Review> {
    const product = await this.productsService.findOne({ productId });

    if (!product) {
      throw new Error('해당 상품이 존재하지 않습니다.');
    }
    const review = this.reviewsRepository.create({
      ...createReviewInput,
      product,
    });

    return this.reviewsRepository.save(review);
  }

  async delete({ reviewId }: IReviewsServiceDelete): Promise<boolean> {
    const review = await this.findOne({ reviewId });

    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }

    const result = await this.reviewsRepository.delete({ id: reviewId });
    return result.affected > 0;
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
