import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookProduct } from './entitites/bookproduct.entity';

@Injectable()
export class BookProductsService {
  constructor(
    @InjectRepository(BookProduct)
    private readonly bookProductsRepository: Repository<BookProduct>,
  ) {}

  async create(bookProduct: Partial<BookProduct>): Promise<BookProduct> {
    return await this.bookProductsRepository.save(bookProduct);
  }

  async delete({ id }: { id: string }): Promise<boolean> {
    const result = await this.bookProductsRepository.delete({ id });
    return result.affected && result.affected > 0;
  }
}
