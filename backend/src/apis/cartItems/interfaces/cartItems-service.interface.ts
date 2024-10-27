import { Cart } from 'src/apis/carts/entities/cart.entity';
import { Product } from 'src/apis/products/entities/product.entity';

export interface ICartItemsServiceAdd {
  product: Product; // 카트에 추가할 상품
  quantity: number; // 상품의 수량
  cart: Cart;
}

export interface ICartItemsServiceDelete {
  cartItemId: string;
}
