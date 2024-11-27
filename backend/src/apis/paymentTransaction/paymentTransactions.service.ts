import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  PAYMENT_TRANSACTION_STATUS_ENUM,
  PaymentTransaction,
} from './entities/paymentTransaction.entity';
import { UsersService } from '../users/users.service';
import {
  IPaymentTransactionsServiceCancel,
  IPaymentTransactionsServiceCheckDuplication,
  IPaymentTransactionsServiceCreate,
  IPaymentTransactionsServiceFindAll,
  IPaymentTransactionsServiceFindOneByImpUid,
  IPaymentTransactionsServiceFindOneByImpUidAndUser,
} from './interfaces/payment-transactions-service.interface';
import { IamportService } from '../iamport/iamport.service';

@Injectable()
export class PaymentTransactionsService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionsRepository: Repository<PaymentTransaction>,
    private readonly usersService: UsersService,
    private readonly iamportService: IamportService,
    private readonly dataSource: DataSource,
  ) {}

  async findOneByImpUid({
    impUid,
  }: IPaymentTransactionsServiceFindOneByImpUid): Promise<PaymentTransaction> {
    const transaction = await this.paymentTransactionsRepository.findOne({
      where: {
        impUid,
      },
    });

    if (!transaction) {
      throw new NotFoundException('해당 결제 거래를 찾을 수 없습니다.');
    }

    return transaction;
  }

  async findOneByImpUidAndUser({
    impUid,
    user,
  }: IPaymentTransactionsServiceFindOneByImpUidAndUser): Promise<
    PaymentTransaction[]
  > {
    const transaction = await this.paymentTransactionsRepository.find({
      where: { impUid, user: { id: user.id } },
      relations: ['user'],
    });

    if (!transaction) {
      throw new NotFoundException(
        '해당 아이디의 결제 거래를 찾을 수 없습니다.',
      );
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
    status = PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
  }: IPaymentTransactionsServiceCreate): Promise<PaymentTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentTransaction = this.paymentTransactionsRepository.create({
        impUid,
        amount,
        user: _user,
        status,
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

  async createForPayment({
    impUid,
    amount,
    user,
    status,
  }: IPaymentTransactionsServiceCreate): Promise<PaymentTransaction> {
    await this.iamportService.checkPaid({ impUid, amount });
    await this.checkDuplication({ impUid });

    return await this.create({ impUid, amount, user, status });
  }

  async checkDuplication({
    impUid,
  }: IPaymentTransactionsServiceCheckDuplication): Promise<void> {
    const result = await this.findOneByImpUid({ impUid });
    if (result) {
      throw new ConflictException('이미 등록된 결제아이디입니다.');
    }
  }

  async cancel({
    impUid,
    user,
  }: IPaymentTransactionsServiceCancel): Promise<PaymentTransaction> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentTransactions = await this.findOneByImpUidAndUser({
        impUid,
        user,
      });

      const canceledPaymentTransactions = paymentTransactions.filter(
        (el) => el.status === PAYMENT_TRANSACTION_STATUS_ENUM.CANCEL,
      );

      if (canceledPaymentTransactions.length > 0) {
        throw new ConflictException('이미 취소된 결제아이디입니다');
      }

      const paidPaymentTransactions = paymentTransactions.filter(
        (el) => el.status === PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
      );

      if (paidPaymentTransactions.length === 0) {
        throw new UnprocessableEntityException(
          '결제 기록이 존재하지 않습니다.',
        );
      }

      if (
        paidPaymentTransactions[0].user.point <
        Math.floor(paidPaymentTransactions[0].amount * 0.02)
      ) {
        throw new ConflictException('회수할 포인트가 부족합니다.');
      }

      const canceledAmount = await this.iamportService.cancel({ impUid });

      const transaction = await this.create({
        impUid,
        amount: -canceledAmount,
        user,
        status: PAYMENT_TRANSACTION_STATUS_ENUM.CANCEL,
      });

      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
