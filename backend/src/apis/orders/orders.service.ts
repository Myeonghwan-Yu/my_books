import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order, PaymentStatus } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IOrdersServiceCreate,
  IOrdersServiceDelete,
  IOrdersServiceFindAll,
  IOrdersServiceFindOne,
} from './interfaces/orders-service.interface';
import { OrderItemService } from '../orderItems/orderItems.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>, //
    private readonly orderItemsService: OrderItemService,
    private readonly productsService: ProductsService,
  ) {}

  async findOne({ orderId }: IOrdersServiceFindOne): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('해당하는 주문 내역이 존재하지 않습니다');
    }

    return order;
  }

  async findAll({ userId }: IOrdersServiceFindAll): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }

  async create({
    userId,
    createOrderInput,
  }: IOrdersServiceCreate): Promise<Order> {
    const order = this.ordersRepository.create({
      user: { id: userId },
      orderItems: [],
      paymentStatus: PaymentStatus.PENDING,
    });

    let totalPrice = 0;

    for (const item of createOrderInput.orderItems) {
      const product = await this.productsService.findOne(item.productId);
      const orderItemPrice = product.price * item.quantity;

      const orderItem = this.orderItemsService.create({
        product,
        quantity: item.quantity,
        totalPrice: orderItemPrice,
      });

      order.orderItems.push(orderItem);

      totalPrice += orderItemPrice;
    }

    order.orderTotalPrice = totalPrice;

    await this.orderItemsService.save(order.orderItems);

    return this.ordersRepository.save(order);
  }

  async delete({ orderId, userId }: IOrdersServiceDelete): Promise<boolean> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['user'],
    });

    if (!order) {
      throw new NotFoundException('해당 주문을 찾을 수 없습니다.');
    }

    if (order.user.id !== userId) {
      throw new ForbiddenException('본인이 생성한 주문만 삭제할 수 있습니다.');
    }

    await this.ordersRepository.delete({ id: orderId });

    return true;
  }
}
