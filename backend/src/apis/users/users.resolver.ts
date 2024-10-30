import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { IContext } from 'src/commons/interfaces/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UpdateUserInput } from './dto/update-user-input';
import { CreateUserInput } from './dto/create-user-input';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  @UseGuards(GqlAuthGuard('access'))
  @Query(() => User)
  async fetchUser(
    @Context() context: IContext, //
  ): Promise<User> {
    const userId = context.req.user.id;

    const user = await this.usersService.findOneById({ userId });
    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create({ createUserInput });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => User)
  async updateUser(
    @Context() context: IContext,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const userId = context.req.user.id;
    return this.usersService.update({ userId, updateUserInput });
  }

  @UseGuards(GqlAuthGuard('access'))
  @Mutation(() => Boolean)
  async deleteUser(@Context() context: IContext): Promise<boolean> {
    const userId = context.req.user.id;

    const result = await this.usersService.delete({ userId });
    return result;
  }
}
