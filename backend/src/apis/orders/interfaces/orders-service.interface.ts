import { CreateOrderInput } from '../dto/create-order.input';

export class IOrdersServiceFindOne {
  orderId: string;
}

export class IOrdersServiceFindAll {
  userId: string;
}

export class IOrdersServiceCreate {
  userId: string;
  createOrderInput: CreateOrderInput;
}

export class IOrdersServiceDelete {
  userId: string;
  orderId: string;
}
