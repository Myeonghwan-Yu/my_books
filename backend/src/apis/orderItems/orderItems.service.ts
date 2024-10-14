import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
  ) {}

  async create({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }): Promise<OrderItem> {
    const product = await this.productsService.findOne({ id: productId });

    const orderItem = this.orderItemsRepository.create({
      product,
      quantity,
      totalPrice: product.price * quantity,
    });

    return this.orderItemsRepository.save(orderItem);
  }
}
