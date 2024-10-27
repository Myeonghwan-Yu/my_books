import { IAuthUser } from 'src/commons/interfaces/context';

export interface IPaymentTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
}

export interface IPaymentTransactionsServiceFindOne {
  impUid: string;
  userId: string;
}

export interface IPaymentTransactionsServiceFindAll {
  userId: string;
}
