import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceRestoreAccessToken,
  IAuthServiceSetRefreshToken,
  IAuthServiceSetRefreshTokenByRestAPI,
} from './interfaces/auth-service.interface';
import { JwtService } from '@nestjs/jwt';
import { IContext } from 'src/commons/interfaces/context';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService, //
  ) {}

  async login({
    email,
    password,
    context,
  }: IAuthServiceLogin): Promise<string> {
    const user = await this.usersService.findOneByEmail({ email });

    if (!user) {
      throw new UnprocessableEntityException('회원 정보가 없습니다.');
    }

    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('암호가 잘못되었습니다.');
    }

    this.setRefreshToken({ user, context });

    return this.getAccessToken({ user });
  }

  setRefreshToken({ user, context }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: '나의리프레시비밀번호', expiresIn: '2w' },
    );

    context.res.setHeader(
      'set-Cookie', //
      `refreshToken=${refreshToken}; path=/;`,
    );
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }

  restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
    return this.getAccessToken({ user });
  }

  logOut(context: IContext): void {
    context.res.setHeader(
      'set-Cookie',
      `refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`,
    );
  }

  setRefreshTokenByRestAPI({
    user,
    res,
  }: IAuthServiceSetRefreshTokenByRestAPI): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: '나의리프레시비밀번호', expiresIn: '2w' },
    );

    res.setHeader(
      'set-Cookie', //
      `refreshToken=${refreshToken}; path=/;`,
    );
  }
}
