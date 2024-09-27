import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ICartsServiceAddToCart } from './interfaces/carts-service.interface';
import { CartItemsService } from '../cartItems/cartitems.service';

Injectable({ scope: Scope.DEFAULT });
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly cartItemsService: CartItemsService,
    private readonly usersService: UsersService,
  ) {}

  async addToCart({
    addToCartInput,
    userId,
  }: ICartsServiceAddToCart): Promise<Cart> {
    const user = await this.usersService.findOneById({ userId });

    let cart = await this.cartRepository.findOne({ where: { user } });

    if (!cart) {
      cart = this.cartRepository.create({ user, items: [] });
      await this.cartRepository.save({ ...cart });
    }

    await this.cartItemsService.addCartItem({
      cartId: cart.id,
      addToCartInput,
    });

    return this.cartRepository.findOne({ where: { user } });
  }
}