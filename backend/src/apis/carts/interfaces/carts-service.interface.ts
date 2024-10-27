import { AddProductToCartInput } from '../dto/add-product-to-cart-input';
import { UpdateCartInput } from '../dto/update-cart-input';

export interface ICartsServiceCreateCart {
  userId: string;
}

export interface ICartsServiceFindOne {
  userId: string;
}

export interface ICartsServiceAddProductToCart {
  userId: string;
  addProductToCartInput: AddProductToCartInput;
}

export interface ICartsServiceUpdateCartItem {
  userId: string;
  updateCartInput: UpdateCartInput;
}

export interface ICartsServiceDeleteCart {
  userId: string;
}

export interface ICartsServiceDeleteCartItem {
  userId: string;
  productId: string;
}
