import { Module } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';
import { OrderItemService } from '../orderItems/orderItems.service';
import { ProductsModule } from '../products/products.module';
import { OrderItem } from '../orderItems/entities/orderItem.entity';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order, //
      OrderItem,
    ]),
    UsersModule,
    ProductsModule,
    CartsModule,
  ],

  providers: [
    OrdersResolver, //
    OrdersService,
    OrderItemService,
  ],
})
export class OrdersModule {}
