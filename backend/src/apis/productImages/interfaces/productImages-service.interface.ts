import { FileUpload } from 'graphql-upload';

export interface IProductImagesServiceUpload {
  productId: string;
  productImages: FileUpload[];
}

export interface IProductImagesServiceDelete {
  productId: string;
  productImages: FileUpload[];
}
