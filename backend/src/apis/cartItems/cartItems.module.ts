import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitem.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { CartItemsService } from './cartItems.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartItem, //
    ]),
    UsersModule,
    ProductsModule,
  ],
  providers: [CartItemsService],
  exports: [CartItemsService],
})
export class CartItemsModule {}
