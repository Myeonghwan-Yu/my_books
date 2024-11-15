import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ProductsService } from '../products/products.service';
import {
  IReviewsServiceCreate,
  IReviewsServiceDelete,
  IReviewsServiceFindAllByProductId,
  IReviewsServiceFindAllByUserId,
  IReviewsServiceFindOne,
  IReviewsServiceUpdate,
} from './interfaces/reviews-service.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async findOne({ reviewId }: IReviewsServiceFindOne): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }

    return review;
  }

  async findAllByUserId({ userId }: IReviewsServiceFindAllByUserId) {
    return await this.reviewsRepository.find({
      where: { user: { id: userId } },
    });
  }

  async findAllByProductId({
    productId,
  }: IReviewsServiceFindAllByProductId): Promise<Review[]> {
    return await this.reviewsRepository.find({
      where: { product: { id: productId } },
    });
  }

  async create({
    productId,
    userId,
    createReviewInput,
  }: IReviewsServiceCreate): Promise<Review> {
    const product = await this.productsService.findOne({ productId });

    if (!product) {
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    }

    const user = await this.usersService.findOneById({ userId });

    if (!user) {
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }

    const review = this.reviewsRepository.create({
      ...createReviewInput,
      product,
      user,
    });

    return this.reviewsRepository.save(review);
  }

  async delete({ userId, reviewId }: IReviewsServiceDelete): Promise<boolean> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const review = await this.findOne({ reviewId });

    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('이 리뷰를 삭제할 권한이 없습니다.');
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
