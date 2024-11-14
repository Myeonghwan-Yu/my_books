import { CreateReviewInput } from '../dto/create-review.input';
import { UpdateReviewInput } from '../dto/update-review.input';

export class IReviewsServiceFindOne {
  reviewId: string;
}

export class IReviewsServiceFindAllByProductId {
  productId: string;
}

export class IReviewsServiceFindAllByUserId {
  userId: string;
}

export class IReviewsService {}

export class IReviewsServiceCreate {
  productId: string;
  userId: string;
  createReviewInput: CreateReviewInput;
}

export class IReviewsServiceUpdate {
  reviewId: string;
  updateReviewInput: UpdateReviewInput;
}

export class IReviewsServiceDelete {
  userId: string;
  reviewId: string;
}
