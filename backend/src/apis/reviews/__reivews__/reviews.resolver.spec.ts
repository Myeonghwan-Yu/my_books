import { ReviewsResolver } from '../reviews.resolver';
import { ReviewsService } from '../reviews.service';
import { Test, TestingModule } from '@nestjs/testing';

class MockReviewService {
  fetchReview(): string {
    return 'mockFetchReview';
  }
}

describe('ReviewsResolver', () => {
  let reviewsResolver: ReviewsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReviewsService,
          useClass: MockReviewService,
        },
      ],
    }).compile();

    reviewsResolver = module.get<ReviewsResolver>(ReviewsResolver);
  });

  describe('fetchReview', () => {
    it('이 테스트의 검증 결과는 "hello world"를 리턴해야 함', () => {
      const result = reviewsResolver.fetchReview('hello world');
      expect(result).toBe('mockFetchReview');
    });
  });
});
