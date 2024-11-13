import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookProduct } from './entitites/bookproduct.entity';
import {
  IBookProductServiceCreate,
  IBookProductServiceDelete,
  IBookProductServiceFindOne,
} from './interfaces/bookProducts-service.interface';

@Injectable()
export class BookProductsService {
  constructor(
    @InjectRepository(BookProduct)
    private readonly bookProductsRepository: Repository<BookProduct>,
  ) {}

  async findOne({
    isbn,
  }: IBookProductServiceFindOne): Promise<BookProduct | null> {
    return this.bookProductsRepository.findOne({
      where: { isbn },
    });
  }

  async create({
    bookProductInput,
  }: IBookProductServiceCreate): Promise<BookProduct> {
    return await this.bookProductsRepository.save({ ...bookProductInput });
  }

  async delete({ bookProductId }: IBookProductServiceDelete): Promise<boolean> {
    const result = await this.bookProductsRepository.delete({
      id: bookProductId,
    });

    return result.affected > 0;
  }
}
