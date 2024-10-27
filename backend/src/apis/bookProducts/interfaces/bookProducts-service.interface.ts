import { BookProductInput } from 'src/apis/products/dto/create-product.input';

export class IBookProductServiceCreate {
  bookProductInput: BookProductInput;
}

export class IBookProductServiceDelete {
  bookProductId: string;
}
