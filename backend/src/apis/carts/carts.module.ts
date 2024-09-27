import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartsResolver } from './carts.resolver';
import { CartsService } from './carts.service';
import { UsersModule } from '../users/users.module';
import { CartItemsService } from '../cartItems/cartitems.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart, //
    ]),
    UsersModule,
  ],
  providers: [
    CartsResolver, //
    CartsService,
    CartItemsService,
    UsersService,
  ],

  exports: [CartsService],
})
export class CartsModule {}
