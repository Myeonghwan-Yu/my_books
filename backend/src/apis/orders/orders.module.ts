import { Module } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order, //
    ]),
    UsersModule,
  ],

  providers: [
    OrdersResolver, //
    OrdersService,
  ],
})
export class OrdersModule {}
