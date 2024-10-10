import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interfaces/context';
import { AddProductToCartInput } from './dto/add-product-to-cart-input';
import { UpdateCartInput } from './dto/update-cart-input';
import { CartItemsService } from '../cartItems/cartItems.service';

@Resolver()
export class CartsResolver {
  constructor(
    private readonly cartsService: CartsService, //
    private readonly cartItemsService: CartItemsService,
  ) {}

  @Query(() => Cart)
  @UseGuards(GqlAuthGuard('access'))
  async fetchCart(@Context() context: IContext): Promise<Cart> {
    const userId = context.req.user.id;
    return this.cartsService.findOne({ userId });
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard('access'))
  async createCart(@Context() context: IContext): Promise<Cart> {
    const userId = context.req.user.id;
    return this.cartsService.createCart({ userId });
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard('access'))
  async addProductToCart(
    @Context() context: IContext,
    @Args('addProductToCartInput') addProductToCartInput: AddProductToCartInput,
  ): Promise<Cart> {
    const userId = context.req.user.id;
    return this.cartsService.addProductToCart({
      userId,
      addProductToCartInput,
    });
  }

  @Mutation(() => Cart)
  @UseGuards(GqlAuthGuard('access'))
  async updateCartItem(
    @Context() context: IContext,
    @Args('updateCartInput') updateCartInput: UpdateCartInput,
  ): Promise<Cart> {
    const userId = context.req.user.id;
    return this.cartsService.updateCartItem({
      userId,
      updateCartInput,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard('access'))
  async deleteCart(@Context() context: IContext): Promise<boolean> {
    const userId = context.req.user.id;
    return this.cartsService.deleteCart({ userId });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard('access'))
  async deleteCartItem(
    @Context() context: IContext,
    @Args('productId') productId: string,
  ): Promise<boolean> {
    const userId = context.req.user.id;
    return this.cartItemsService.delete({ userId, productId });
  }
}
