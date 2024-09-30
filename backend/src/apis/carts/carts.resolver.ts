import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class CartsResolver {
  constructor(
    private readonly cartsService: CartsService, //
  ) {}

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard('access'))
  async createCart(@Context() context: IContext): Promise<Cart> {
    const userId = context.req.user.id;
    return this.cartsService.createCart({ userId }); // 카트 생성 서비스 호출
  }
}
