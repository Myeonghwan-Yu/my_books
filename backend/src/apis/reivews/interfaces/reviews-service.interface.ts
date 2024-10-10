import { CreateReviewInput } from '../dto/create-review.input';
import { UpdateReviewInput } from '../dto/update-review.input';

export class IReviewsServiceCreate {
  productId: string;
  createReviewInput: CreateReviewInput;
}

export class IReviewsServiceUpdate {
  reviewId: string;
  updateReviewInput: UpdateReviewInput;
}

export class IReviewsServiceDelete {
  reviewId: string;
}

export class IReviewsServiceFindOne {
  reviewId: string;
}

export class IReviewsServiceFindAll {
  productId: string;
}
