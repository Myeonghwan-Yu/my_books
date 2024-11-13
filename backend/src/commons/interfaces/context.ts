import { Request, Response } from 'express';

export interface IAuthUser {
  user?: {
    id: string;
  };
}

export interface IOAuthUser {
  user: {
    name: string;
    email: string;
    password: string;
    age: number;
  };
}

export interface IContext {
  req: Request & IAuthUser;
  res: Response;
}
