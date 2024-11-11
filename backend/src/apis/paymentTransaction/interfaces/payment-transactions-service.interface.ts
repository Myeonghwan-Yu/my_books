import { IAuthUser } from 'src/commons/interfaces/context';
import { PAYMENT_TRANSACTION_STATUS_ENUM } from '../entities/paymentTransaction.entity';

export interface IPaymentTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
  status?: PAYMENT_TRANSACTION_STATUS_ENUM;
}

export interface IPaymentTransactionsServiceFindOneByImpUid {
  impUid: string;
}

export interface IPaymentTransactionsServiceFindAll {
  userId: string;
}

export interface IPaymentTransactionsServiceFindOneByImpUidAndUser {
  impUid: string;
  user: IAuthUser['user'];
}

export interface IPaymentTransactionsServiceCheckDuplication {
  impUid: string;
}

export interface IPaymentTransactionsServiceCancel {
  impUid: string;
  user: IAuthUser['user'];
}
