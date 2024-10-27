import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  PAYMENT_TRANSACTION_STATUS_ENUM,
  PaymentTransaction,
} from './entities/paymentTransaction.entity';
import { UsersService } from '../users/users.service';
import {
  IPaymentTransactionsServiceCreate,
  IPaymentTransactionsServiceFindAllByUserId,
} from './interfaces/payment-transactions-service.interface';

@Injectable()
export class PaymentTransactionsService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionsRepository: Repository<PaymentTransaction>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async findAllByUserId({
    userId,
  }: IPaymentTransactionsServiceFindAllByUserId): Promise<
    PaymentTransaction[]
  > {
    return await this.paymentTransactionsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async create({
    impUid,
    amount,
    user: _user,
  }: IPaymentTransactionsServiceCreate): Promise<PaymentTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentTransaction = this.paymentTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status: PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      await queryRunner.manager.save(paymentTransaction);

      const user = await this.usersService.findOneById({ userId: _user.id });

      if (!user) {
        throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
      }

      const rewardPoints = Math.floor(amount * 0.02);
      await this.usersService.update(
        {
          userId: _user.id,
          updateUserInput: { point: user.point + rewardPoints },
        },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
      return paymentTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
