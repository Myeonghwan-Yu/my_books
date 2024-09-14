import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookProduct } from './entitites/bookproduct.entity';
import {
  IBookProductServiceCreate,
  IBookProductServiceDelete,
} from './interfaces/bookProducts-service.interface';

@Injectable()
export class BookProductsService {
  constructor(
    @InjectRepository(BookProduct)
    private readonly bookProductsRepository: Repository<BookProduct>,
  ) {}

  async create({
    bookProductInput,
  }: IBookProductServiceCreate): Promise<BookProduct> {
    const result = await this.bookProductsRepository.save({
      ...bookProductInput,
    });
    return result;
  }

  async delete({ id }: IBookProductServiceDelete): Promise<boolean> {
    const result = await this.bookProductsRepository.delete({ id });
    return result.affected && result.affected > 0;
  }
}
