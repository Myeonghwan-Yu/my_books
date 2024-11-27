import { Test } from '@nestjs/testing';
import { ReviewsService } from '../reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';

class MockReviewsRepository {
  mydb = [
    {
      id: '1',
      title: '좋은 책을 읽고.',
      content: '항상 좋은 책을 읽는 것은 기쁩니다.',
      rating: 5,
      product: {
        id: 'book-1',
        name: '삼국지연의',
      },
      user: {
        id: 'user-1',
        name: '장민수',
      },
    },
    {
      id: '2',
      title: '펜 상태가 좋지않음',
      content: '사용감이 매우 나쁘고, 고장이 잘 났음',
      rating: 2,
      product: {
        id: 'pen-1',
        name: '검은색 펜',
      },
      user: {
        id: 'user-2',
        name: '김철수',
      },
    },
  ];

  create(createReviewInput) {
    const newReview = {
      ...createReviewInput,
      id: String(this.mydb.length + 1),
    };
    this.mydb.push(newReview);
    return newReview;
  }

  findOne(id: string) {
    return this.mydb.find((review) => review.id === id);
  }
}

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;

  beforeEach(async () => {
    const reviewsModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useClass: MockReviewsRepository,
        },
      ],
    }).compile();

    reviewsService = reviewsModule.get<ReviewsService>(ReviewsService);
  });

  describe('create', () => {});
});
