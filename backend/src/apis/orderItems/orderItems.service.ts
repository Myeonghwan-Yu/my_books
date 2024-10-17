import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { IOrderItemsServiceCreate } from './interfaces/order-items-service.interface';
import { OrdersService } from '../orders/orders.service';

export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService,
  ) {}

  async create({
    orderId,
    productId,
    quantity,
    itemTotalPrice,
  }: IOrderItemsServiceCreate): Promise<OrderItem> {
    const order = await this.ordersService.findOne({ orderId });
    const product = await this.productsService.findOne({ productId });

    const orderItem = this.orderItemsRepository.create({
      order: { id: order.id },
      product: { id: product.id },
      quantity,
      itemTotalPrice: itemTotalPrice,
    });

    return await this.orderItemsRepository.save(orderItem);
  }
}
