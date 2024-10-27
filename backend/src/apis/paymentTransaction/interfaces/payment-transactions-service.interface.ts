import { IAuthUser } from 'src/commons/interfaces/context';

export interface IPaymentTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
}

export interface IPaymentTransactionsServiceFindAllByUserId {
  userId: string;
}
