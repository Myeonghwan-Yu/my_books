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

export class IReviewServiceDelete {
  reviewId: string;
}

export class IReivewServiceFindOne {
  reviewId: string;
}

export class IReviewServiceFindAll {
  productId: string;
}
