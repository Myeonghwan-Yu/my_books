import { CreateProductInput } from '../dto/create-product.input';

export interface IProductsCreateServiceCreate {
  createProductInput: CreateProductInput;
}

export interface IProductsServiceFindOne {
  productId: string;
}
