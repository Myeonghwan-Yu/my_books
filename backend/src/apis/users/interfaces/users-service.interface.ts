import { CreateUserInput } from '../dto/create-user-input';
import { UpdateUserInput } from '../dto/update-user-input';

export interface IUsersServiceFindOneByEmail {
  email: string;
}

export interface IUsersServiceFindOneById {
  userId: string;
}

export interface IUsersServiceCreate {
  createUserInput: CreateUserInput;
}

export interface IUsersServiceUpdate {
  userId: string;
  updateUserInput: UpdateUserInput;
}

export interface IUsersServiceDelete {
  userId: string;
}

export interface IUsersServiceIsDeleted {
  userId: string;
}
