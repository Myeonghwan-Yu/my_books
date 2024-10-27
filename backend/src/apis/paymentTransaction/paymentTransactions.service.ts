import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  PAYMENT_TRANSACTION_STATUS_ENUM,
  PaymentTransaction,
} from './entities/paymentTransaction.entity';
import { UsersService } from '../users/users.service';
import {
  IPaymentTransactionsServiceCreate,
  IPaymentTransactionsServiceFindAll,
  IPaymentTransactionsServiceFindOne,
} from './interfaces/payment-transactions-service.interface';

@Injectable()
export class PaymentTransactionsService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionsRepository: Repository<PaymentTransaction>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async findOne({
    impUid,
    userId,
  }: IPaymentTransactionsServiceFindOne): Promise<PaymentTransaction> {
    if (!impUid) {
      throw new BadRequestException('유효하지 않은 impUid입니다.');
    }

    const transaction = await this.paymentTransactionsRepository.findOne({
      where: {
        impUid,
        user: { id: userId },
      },
    });

    if (!transaction) {
      throw new NotFoundException('해당 결제 거래를 찾을 수 없습니다.');
    }

    return transaction;
  }

  async findAll({
    userId,
  }: IPaymentTransactionsServiceFindAll): Promise<PaymentTransaction[]> {
    const transactions = await this.paymentTransactionsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException('해당 유저의 결제 거래가 없습니다.');
    }

    return transactions;
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
