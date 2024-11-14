import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService, //
  ) {}

  @Query(() => Review)
  async fetchReviewsByReviewId(@Args('reviewId') reviewId: string) {
    return this.reviewsService.findOne({ reviewId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => [Review])
  async fetchReviewsByUserId(
    @Context() context: IContext, //
  ) {
    const userId = context.req.user.id;
    return this.reviewsService.findAllByUserId({ userId });
  }

  @Query(() => [Review])
  async fetchReviewsByProductId(
    @Args('productId') productId: string,
  ): Promise<Review[]> {
    return await this.reviewsService.findAllByProductId({ productId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Review)
  async createReview(
    @Args('productId') productId: string,
    @Args('createReviewInput') createReviewInput: CreateReviewInput,
    @Context() context: IContext,
  ): Promise<Review> {
    const userId = context.req.user.id;

    return this.reviewsService.create({
      productId,
      userId,
      createReviewInput,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteReview(
    @Args('reviewId') reviewId: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    const userId = context.req.user.id;
    return this.reviewsService.delete({ userId, reviewId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Review)
  async updateReview(
    @Args('reviewId') reviewId: string,
    @Args('updateReviewInput') updateReviewInput: UpdateReviewInput,
  ): Promise<Review> {
    return this.reviewsService.update({ reviewId, updateReviewInput });
  }
}
