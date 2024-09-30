import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartsResolver } from './carts.resolver';
import { CartsService } from './carts.service';
import { UsersModule } from '../users/users.module';
import { CartItemsService } from '../cartItems/cartItems.service';
import { ProductsModule } from '../products/products.module';
import { CartItem } from '../cartItems/entities/cartitem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart, //
      CartItem,
    ]),
    UsersModule,
    ProductsModule,
  ],

  providers: [
    CartsResolver, //
    CartsService,
    CartItemsService,
  ],

  exports: [CartsService],
})
export class CartsModule {}
