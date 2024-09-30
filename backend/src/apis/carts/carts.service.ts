import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import {
  ICartsServiceCreateCart,
  ICartsServiceFindOne,
} from './interfaces/carts-service.interface';
import { CartItemsService } from '../cartItems/cartItems.service';
import { ProductsService } from '../products/products.service';

Injectable({ scope: Scope.DEFAULT });
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    private readonly productsService: ProductsService,
    private readonly cartItemsService: CartItemsService,
    private readonly usersService: UsersService,
  ) {}

  async createCart({ userId }: ICartsServiceCreateCart): Promise<Cart> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const existingCart = await this.findOne({ userId });
    const cart =
      existingCart ||
      this.cartsRepository.create({ user: { id: userId }, items: [] });

    return this.cartsRepository.save(cart);
  }

  async findOne({ userId }: ICartsServiceFindOne): Promise<Cart> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    const cart = await this.cartsRepository.findOne({
      where: { user: { id: userId } }, // userId를 통해 카트 검색
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('해당 유저의 카트를 찾을 수 없습니다.');
    }

    return cart;
  }
}
