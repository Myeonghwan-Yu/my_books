import { Request, Response } from 'express';
import { User } from 'src/apis/users/entities/user.entity';
import {
  IAuthUser,
  IContext,
  IOAuthUser,
} from 'src/commons/interfaces/context';

export interface IAuthServiceLogin {
  email: string;
  password: string;
  context: IContext;
}

export interface IAuthServiceLoginOAuth {
  req: Request & IOAuthUser;
  res: Response;
}

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUser['user'];
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  context: IContext;
}

export interface IAuthServiceRestoreAccessToken {
  user: IAuthUser['user'];
}

export interface IAuthServiceSetRefreshTokenByRestAPI {
  user: IAuthUser['user'];
  res: Response;
}
