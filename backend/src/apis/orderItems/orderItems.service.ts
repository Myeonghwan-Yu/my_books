import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Repository } from 'typeorm';
import { IOrderItemsServiceCreate } from './interfaces/order-items-service.interface';

export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {}

  async create({
    orderId,
    productId,
    quantity,
    itemTotalPrice,
  }: IOrderItemsServiceCreate): Promise<OrderItem> {
    const orderItem = this.orderItemsRepository.create({
      order: { id: orderId },
      product: { id: productId },
      quantity,
      itemTotalPrice,
    });

    return await this.orderItemsRepository.save(orderItem);
  }
}
