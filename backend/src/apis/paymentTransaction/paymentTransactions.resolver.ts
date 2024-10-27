import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PaymentTransaction } from './entities/paymentTransaction.entity';
import { IContext } from 'src/commons/interfaces/context';
import { PaymentTransactionsService } from './paymentTransactions.service';

@Resolver()
export class PaymentTransactionsResolver {
  constructor(
    private readonly paymentTransactionsService: PaymentTransactionsService,
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => PaymentTransaction)
  async fetchPaymentTransaction(
    @Args('impUid') impUid: string,
    @Context() context: IContext,
  ): Promise<PaymentTransaction> {
    const userId = context.req.user.id;

    return this.paymentTransactionsService.findOne({
      impUid,
      userId,
    });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => [PaymentTransaction])
  async fetchPaymentTransactions(
    @Context() context: IContext,
  ): Promise<PaymentTransaction[]> {
    const userId = context.req.user.id;
    return this.paymentTransactionsService.findAll({ userId });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => PaymentTransaction)
  async createPaymentTransaction(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ): Promise<PaymentTransaction> {
    const user = context.req.user;
    return this.paymentTransactionsService.create({ impUid, amount, user });
  }
}
