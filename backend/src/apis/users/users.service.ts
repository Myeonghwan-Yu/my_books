import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById({ userId }: IUsersServiceFindOneById): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async create({ createUserInput }: IUsersServiceCreate): Promise<User> {
    const { email, password, name, age } = createUserInput;

    const existingUser = await this.findOneByEmail({ email });
    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일입니다.');
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

  async update({
    userId,
    updateUserInput,
  }: IUsersServiceUpdate): Promise<User> {
    const user = await this.findOneById({ userId });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const result = await this.usersRepository.save({
      ...user,
      ...updateUserInput,
    });

    return result;
  }

  async delete({ userId }: IUsersServiceDelete): Promise<boolean> {
    const user = await this.findOneById({ userId });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const result = await this.usersRepository.update(
      { id: userId },
      { deletedAt: new Date() },
    );

    return result.affected ? true : false;
  }
}
