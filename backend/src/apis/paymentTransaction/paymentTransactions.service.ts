import {
  ConflictException,
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
  IPaymentTransactionsServiceCheckDuplication,
  IPaymentTransactionsServiceCreate,
  IPaymentTransactionsServiceFindAll,
  IPaymentTransactionsServiceFindOne,
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

  async findOne({
    impUid,
  }: IPaymentTransactionsServiceFindOne): Promise<PaymentTransaction> {
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
    await this.iamportService.checkPaid({ impUid, amount });
    await this.checkDuplication({ impUid });

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

  async checkDuplication({
    impUid,
  }: IPaymentTransactionsServiceCheckDuplication): Promise<void> {
    const result = await this.findOne({ impUid });
    if (result) {
      throw new ConflictException('이미 등록된 결제아이디입니다.');
    }
  }

  // cancel({ impUid, user }) {
  //   // 1. 이미 취소된 결제인지 확인하기
  //   this.findOne({ impuid });
  //   // 2. 포인트 적립된 2% 회수하기
  //   // 3. 결제 취소하기
  //   const canceldAmount = this.iamportService.cancel({ impUid });
  //   // 4. 취소된 결과 DB에 등록하기
  // }
}
