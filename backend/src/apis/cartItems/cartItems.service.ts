import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitem.entity';
import { Repository } from 'typeorm';
import {
  ICartItemsServiceAdd,
  ICartItemsServiceDelete,
} from './interfaces/cartItems-service.interface';
import { UsersService } from '../users/users.service';
import { CartsService } from '../carts/carts.service';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly cartsService: CartsService,
    private readonly usersService: UsersService,
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

  async delete({
    userId,
    productId,
  }: ICartItemsServiceDelete): Promise<boolean> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const cart = await this.cartsService.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('해당 유저의 카트를 찾을 수 없습니다.');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId,
    );
    if (!cartItem) {
      throw new NotFoundException('해당 상품이 카트에 존재하지 않습니다.');
    }

    await this.cartItemsRepository.delete({ id: cartItem.id });

    return true;
  }
}
