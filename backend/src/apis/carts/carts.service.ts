import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import {
  ICartsServiceAddProductToCart,
  ICartsServiceCreateCart,
  ICartsServiceDeleteCart,
  ICartsServiceDeleteCartItem,
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
      where: { user: { id: userId } },
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
    if (existingCart) {
      throw new BadRequestException('이미 사용자의 카트가 존재합니다.');
    }

    const cart = this.cartsRepository.create({
      user: { id: userId },
      cartItems: [],
    });
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

    const cart = await this.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('사용자의 카트를 찾을 수 없습니다.');
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
      throw new ConflictException('이미 카트에 담겨 있는 상품입니다.');
    }

    const newItem = await this.cartItemsService.add({
      product,
      quantity: addProductToCartInput.quantity,
      cart,
    });

    cart.cartItems.push(newItem);
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

    const cartItemToUpdate = cart.cartItems.find(
      (cartItem) => cartItem.product.id === updateCartInput.productId,
    );

    if (!cartItemToUpdate) {
      throw new NotFoundException('해당 상품이 카트에 존재하지 않습니다.');
    }

    const finalQuantity = cartItemToUpdate.quantity + updateCartInput.quantity;

    if (finalQuantity < 0) {
      throw new BadRequestException('장바구니의 수량은 0 이상이어야 합니다.');
    }

    if (finalQuantity === 0) {
      cart.cartItems = cart.cartItems.filter(
        (cartItem) => cartItem.product.id !== updateCartInput.productId,
      );
    } else {
      cartItemToUpdate.quantity = finalQuantity;
    }

    return this.cartsRepository.save(cart);
  }

  async deleteCart({ userId }: ICartsServiceDeleteCart): Promise<boolean> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const cart = await this.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('해당 유저의 카트를 찾을 수 없습니다.');
    }

    const result = await this.cartsRepository.delete({ id: cart.id });

    return result.affected > 0;
  }

  async deleteCartItem({
    userId,
    productId,
  }: ICartsServiceDeleteCartItem): Promise<boolean> {
    const user = await this.usersService.findOneById({ userId });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const cart = await this.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('해당 유저의 카트를 찾을 수 없습니다.');
    }

    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId,
    );
    if (!cartItem) {
      throw new NotFoundException('해당 상품이 카트에 존재하지 않습니다.');
    }

    const result = await this.cartItemsService.delete({
      cartItemId: cartItem.id,
    });

    return result;
  }
}
