import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './entities/paymentTransaction.entity';
import { PaymentTransactionsResolver } from './paymentTransactions.resolver';
import { PaymentTransactionsService } from './paymentTransactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentTransaction, //
    ]),
  ],
  providers: [
    PaymentTransactionsResolver, //
    PaymentTransactionsService,
  ],
})
export class PaymentTransactionsModule {}
