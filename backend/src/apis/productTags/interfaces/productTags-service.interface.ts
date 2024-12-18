import { UpdateProductInput } from 'src/apis/products/dto/update-product.input';
import { CreateProductTagInput } from '../dto/create-productTag.input';

export class IProductTagsServiceCreate {
  createProductTagInput: CreateProductTagInput;
}

export class IProductTagsServiceFindOneById {
  productTagId: string;
}

export class IProductTagsServiceFindOneByName {
  productTagName: string;
}

export class IProductTagsServiceUpdate {
  productTagId: string;
  updateProductTagInput: UpdateProductInput;
}

export class IProductTagsServiceDelete {
  productTagId: string;
}

export class IProductTagsServiceFindProductsByTag {
  productTagId: string;
}
