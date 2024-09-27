import { AddToCartInput } from '../dto/add-to-cart-input';

export interface ICartsServiceAddToCart {
  addToCartInput: AddToCartInput;
  userId: string;
}
