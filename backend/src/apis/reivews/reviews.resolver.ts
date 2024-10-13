import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  @Query(() => Review)
  async fetchReview(@Args('reviewId') reviewId: string) {
    return this.reviewsService.findOne({ reviewId });
  }

  @Query(() => [Review])
  async fetchReviews(@Args('productId') productId: string): Promise<Review[]> {
    return await this.reviewsService.findAll({ productId });
  }

  @Mutation(() => Review)
  async createReview(
    @Args('productId') productId: string,
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.create({
      productId,
      createReviewInput,
    });
  }

  @Mutation(() => Boolean)
  async deleteReview(@Args('reviewId') reviewId: string): Promise<boolean> {
    return this.reviewsService.delete({ reviewId });
  }

  @Mutation(() => Review)
  async updateReview(
    @Args('reviewId') reviewId: string,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.update({ reviewId, updateReviewInput });
  }
}
