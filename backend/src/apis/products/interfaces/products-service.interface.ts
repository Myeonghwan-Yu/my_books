import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';

export interface IProductsServiceCreate {
  createProductInput: CreateProductInput;
}

export interface IProductsServiceFindOne {
  productId: string;
}

export interface IProductsServiceUpdate {
  productId: string;
  updateProductInput: UpdateProductInput;
}

export interface IProductsServiceDelete {
  productId: string;
}

export interface IProductsServiceAddProductTag {
  productId: string;
  productTagId: string;
}

export interface IProductsServiceCheckSoldOut {
  productId: string;
  quantity: number;
}
