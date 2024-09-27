import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitem.entity';
import { Repository } from 'typeorm';
import { Cart } from '../carts/entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { ICartItemsServiceAddCartItem } from './interfaces/cartItems-service.interface';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async addCartItem({
    cartId,
    addToCartInput,
  }: ICartItemsServiceAddCartItem): Promise<CartItem> {
    const { productId, quantity } = addToCartInput;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('상품이 존재하지 않습니다.');
    }

    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
      throw new Error('카트가 존재하지 않습니다.');
    }

    const existingCartItem = await this.cartItemsRepository.findOne({
      where: { cart: { id: cartId }, product: { id: productId } },
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      return this.cartItemsRepository.save({ ...existingCartItem });
    }

    const cartItem = this.cartItemsRepository.create({
      cart,
      product,
      quantity,
    });

    return this.cartItemsRepository.save({ ...cartItem });
  }
}
