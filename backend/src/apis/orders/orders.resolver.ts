import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { Order } from './entities/order.entity';
import { IContext } from 'src/commons/interfaces/context';
import { CreateOrderInput } from './dto/create-order.input';

@Resolver()
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService, //
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => Order)
  async fetchOrder(@Args('orderId') orderId: string): Promise<Order> {
    return this.ordersService.findOne({ orderId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => [Order])
  async fetchOrders(@Context() context: IContext): Promise<Order[]> {
    const userId = context.req.user.id;
    return await this.ordersService.findAll({ userId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @Context() context: IContext,
  ): Promise<Order> {
    const userId = context.req.user.id;

    return this.ordersService.create({
      userId,
      createOrderInput,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteOrder(
    @Args('orderId') orderId: string,
    @Context() context: IContext,
  ): Promise<boolean> {
    const userId = context.req.user.id;

    return this.ordersService.delete({ orderId, userId });
  }

  // async updateOrder() {} 는 만들지 않음.
}
