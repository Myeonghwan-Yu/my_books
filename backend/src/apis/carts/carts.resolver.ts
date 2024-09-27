import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { AddToCartInput } from './dto/add-to-cart-input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interfaces/context';

@Resolver()
export class CartsResolver {
  constructor(
    private readonly cartsService: CartsService, //
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Cart)
  async addToCart(
    @Context() context: IContext,
    @Args('addToCartInput') addToCartInput: AddToCartInput,
  ): Promise<Cart> {
    const userId = context.req.user.id;
    return this.cartsService.addToCart({ addToCartInput, userId });
  }
}
