import { Module } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order, //
    ]),
  ],

  providers: [
    OrdersResolver, //
    OrdersService,
  ],
})
export class OrdersModule {}
