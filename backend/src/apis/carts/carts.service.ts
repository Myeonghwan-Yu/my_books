import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import {
  ICartsServiceAddProductToCart,
  ICartsServiceCreateCart,
  ICartsServiceDelete,
  ICartsServiceFindOne,
  ICartsServiceUpdateCartItem,
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

  async createCart({ userId }: ICartsServiceCreateCart): Promise<Cart> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const existingCart = await this.findOne({ userId });
    const cart =
      existingCart ||
      this.cartsRepository.create({ user: { id: userId }, cartItems: [] });

    return this.cartsRepository.save(cart);
  }

  async addProductToCart({
    userId,
    addProductToCartInput,
  }: ICartsServiceAddProductToCart): Promise<Cart> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    let cart = await this.findOne({ userId });

    if (!cart) {
      cart = await this.createCart({ userId });
    }

    const product = await this.productsService.findOne({
      productId: addProductToCartInput.productId,
    });
    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }
    const existingItem = cart.cartItems.find(
      (cartItem) => cartItem.product.id === product.id,
    );

    if (existingItem) {
      existingItem.quantity += addProductToCartInput.quantity;
    } else {
      const newItem = await this.cartItemsService.add({
        product,
        quantity: addProductToCartInput.quantity,
        cart,
      });

      cart.cartItems.push(newItem);
    }

    return this.cartsRepository.save(cart);
  }

  async updateCartItem({
    userId,
    updateCartInput,
  }: ICartsServiceUpdateCartItem): Promise<Cart> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const cart = await this.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('해당 유저의 카트를 찾을 수 없습니다.');
    }

    const itemToUpdate = cart.cartItems.find(
      (item) => item.product.id === updateCartInput.productId,
    );

    if (itemToUpdate) {
      itemToUpdate.quantity = updateCartInput.quantity;
    } else {
      throw new NotFoundException('해당 상품이 카트에 존재하지 않습니다.');
    }

    return this.cartsRepository.save(cart);
  }

  async deleteCart({ userId }: ICartsServiceDelete): Promise<boolean> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const cart = await this.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('해당 유저의 카트를 찾을 수 없습니다.');
    }

    await this.cartsRepository.delete({ id: cart.id });

    return true;
  }
}
