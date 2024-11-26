import { Test } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

class MockUsersRepository {
  mydb = [
    {
      id: '1',
      email: 'a@a.com',
      password: '1234',
      name: '김철수',
      age: 20,
      deletedAt: null,
    },
    {
      id: '2',
      email: 'b@b.com',
      password: '12345678',
      name: '김민수',
      age: 30,
      deletedAt: new Date(),
    },
  ];

  findOne({ where }) {
    const user = this.mydb.find(
      (user) => user.email === where.email && user.id === where.id,
    );
    return user || null;
  }

  create(createUserInput) {
    const existingUser = this.mydb.find(
      (user) => user.email === createUserInput.email,
    );

    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const newUser = {
      ...createUserInput,
      id: (this.mydb.length + 1).toString(),
    };
    this.mydb.push(newUser);
    return newUser;
  }

  save(product) {
    this.mydb.push(product);
    return product;
  }

  delete(deleteUserInput) {
    const user = this.findOne({ where: { id: deleteUserInput.id } });

    if (!user) {
      return null;
    }

    if (user.deletedAt !== null) {
      return false;
    }

    user.deletedAt = new Date();
    return true;
  }
}

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const usersModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUsersRepository,
        },
      ],
    }).compile();

    usersService = usersModule.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('이미 등록된 계정인지 검증하기', async () => {
      const createUserInput = {
        email: 'a@a.com',
        password: '1234',
        name: '김철수',
        age: 20,
        deletedAt: null,
      };

      try {
        await usersService.create({ createUserInput });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('이미 삭제된 계정인지 검증하기', async () => {
      const createUserInput = {
        email: 'b@b.com',
        password: '12345678',
        name: '김민수',
        age: 30,
      };

      try {
        await usersService.create({ createUserInput });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('회원등록이 잘 되었는지 검증하기', async () => {
      const createUserInput = {
        email: 'c@c.com',
        password: '1234',
        name: '김철수',
        age: 20,
      };

      const result = await usersService.create({ createUserInput });
      const { id, password, ...rest } = result;
      void id;
      void password;

      expect(rest).toStrictEqual({
        email: 'c@c.com',
        name: '김철수',
        age: 20,
      });
    });

    describe('delete', () => {
      it('사용자가 존재하는지 검증하기', async () => {
        const deleteUserInput = { userId: '999' };

        try {
          await usersService.delete(deleteUserInput);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });

      it('이미 삭제된 계정인지 검증하기', async () => {
        const deleteUserInput = { userId: '2' };

        try {
          await usersService.delete(deleteUserInput);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });
});
