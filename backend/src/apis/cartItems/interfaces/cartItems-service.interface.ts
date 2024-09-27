import { AddToCartInput } from 'src/apis/carts/dto/add-to-cart-input';

export interface ICartItemsServiceAddCartItem {
  cartId: string;
  addToCartInput: AddToCartInput;
}
