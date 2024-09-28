import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitem.entity';
import { Repository } from 'typeorm';
import { Cart } from '../carts/entities/cart.entity';
import { ICartItemsServiceAddCartItem } from './interfaces/cartItems-service.interface';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async addCartItem({
    cartId,
    addToCartInput,
  }: ICartItemsServiceAddCartItem): Promise<CartItem> {
    const { productId, quantity } = addToCartInput;

    const cartItem = this.cartItemsRepository.create({
      cart: { id: cartId },
      product: { id: productId },
      quantity,
    });

    return this.cartItemsRepository.save({ ...cartItem });
  }
}
