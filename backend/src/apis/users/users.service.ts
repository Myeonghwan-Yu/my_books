import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  IUsersServiceCreate,
  IUsersServiceDelete,
  IUsersServiceFindOneByEmail,
  IUsersServiceFindOneById,
  IUsersServiceUpdate,
} from './interfaces/users-service.interface';
import * as bcrypt from 'bcrypt';

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOneById({ userId }: IUsersServiceFindOneById): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    return user;
  }

  async findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    return user;
  }

  async create({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { email, password, name, age } = createUserInput;

    const existingUser = await this.findOneByEmail({ email });

    if (existingUser && existingUser.deletedAt === null) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    if (existingUser && existingUser.deletedAt !== null) {
      throw new ForbiddenException('이미 삭제된 이용자입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      age,
    });

    return this.usersRepository.save(newUser);
  }

  async update(
    { userId, updateUserInput }: IUsersServiceUpdate,
    manager?: EntityManager,
  ): Promise<User> {
    const user = await this.findOneById({ userId });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.deletedAt !== null) {
      throw new ForbiddenException('이미 삭제된 사용자입니다.');
    }

    const updatedUser = this.usersRepository.create({
      ...user,
      ...updateUserInput,
    });

    const result = await (
      manager ? manager.getRepository(User) : this.usersRepository
    ).save(updatedUser);

    return result;
  }

  async delete({ userId }: IUsersServiceDelete): Promise<boolean> {
    const user = await this.findOneById({ userId });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    if (user.deletedAt !== null) {
      throw new ForbiddenException('이미 삭제된 사용자입니다.');
    }

    const result = await this.usersRepository.update(
      { id: userId },
      { deletedAt: new Date() },
    );

    return result.affected > 0;
  }
}
