import { CreateReviewInput } from '../dto/create-review.input';

export class IReviewsServiceCreate {
  productId: string;
  createReviewInput: CreateReviewInput;
}
