import { ConflictException, Injectable, Scope } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IUsersServiceCreate,
  IUsersServiceFindOneByEmail,
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

  async create({
    email,
    password,
    name,
    age,
  }: IUsersServiceCreate): Promise<User> {
    const user = await this.findOneByEmail({ email });
    if (user) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersRepository.save({
      email,
      password: hashedPassword,
      name,
      age,
    });
  }
}
