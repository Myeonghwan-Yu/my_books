import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cartItem.entity';
import { Repository } from 'typeorm';
import {
  ICartItemsServiceAdd,
  ICartItemsServiceDelete,
} from './interfaces/cartItems-service.interface';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
  ) {}

  async add({
    product,
    quantity,
    cart,
  }: ICartItemsServiceAdd): Promise<CartItem> {
    const newItem = this.cartItemsRepository.create({
      product,
      quantity,
      cart,
    });

    return await this.cartItemsRepository.save(newItem);
  }

  async delete({ cartItemId }: ICartItemsServiceDelete): Promise<boolean> {
    const result = await this.cartItemsRepository.delete({ id: cartItemId });

    return result.affected > 0;
  }
}
