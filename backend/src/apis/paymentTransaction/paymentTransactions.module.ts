import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './entities/paymentTransaction.entity';
import { PaymentTransactionsResolver } from './paymentTransactions.resolver';
import { PaymentTransactionsService } from './paymentTransactions.service';
import { UsersModule } from '../users/users.module';
import { IamportService } from '../iamport/iamport.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentTransaction, //
    ]),
    UsersModule,
  ],
  providers: [
    PaymentTransactionsResolver, //
    PaymentTransactionsService,
    IamportService,
  ],
})
export class PaymentTransactionsModule {}
