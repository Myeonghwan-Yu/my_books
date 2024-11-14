import { Test } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from '../reviews.service';
import { UsersService } from 'src/apis/users/users.service';
import { ProductsService } from 'src/apis/products/products.service';
import { Review } from '../entities/review.entity';

// 나만의 DB 만들기
class MockReviewsRepository {
  mydb = [];

  findOne({ where }) {
    where.email;
  }

  save() {}
}

describe('ReviewsService', () => {
  let reviewsService: UsersService;
  let productsService: ProductsService;

  beforeEach(async () => {
    const reviewsModule = await Test.createTestingModule({
      //   imports: [TypeOrmModule],
      //   controllers: [],
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useClass: MockReviewsRepository,
        },
      ],
    }).compile();

    reviewsService = reviewsModule.get<UsersService>(UsersService);
  });

  describe('findOne', () => {
    const result = reviewsService.findOneByEmail({ email: 'a@a.com' });
    expect(result).toBe({
      email: 'a@a.com',
      name: '철수',
    });
  });

  describe('create', () => {
    it('프로덕트가 존재하는지 검증하기', () => {
      const myData = {
        //
      };
    });

    it('리뷰 등록이 잘 됐는지 검증하기', () => {});
  });
});
