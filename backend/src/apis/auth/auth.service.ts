import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
  IAuthServiceLoginOAuth,
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

  async loginOAuth({ req, res }: IAuthServiceLoginOAuth) {
    let user = await this.usersService.findOneByEmail({
      email: req.user.email,
    });

    if (!user) {
      user = await this.usersService.create({
        createUserInput: {
          email: req.user.email,
          password: req.user.password,
          name: req.user.name,
          age: 0,
        },
      });
      this.setRefreshTokenByRestAPI({ user, res });
    }

    res.redirect('http://localhost:5500/frontend/social-login.html');
  }

  setRefreshToken({ user, context }: IAuthServiceSetRefreshToken): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: '리프레시비밀번호', expiresIn: '2w' },
    );

    context.res.setHeader(
      'set-Cookie', //
      `refreshToken=${refreshToken}; path=/;`,
    );
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: '엑세스비밀번호', expiresIn: '1h' },
    );
  }

  restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
    return this.getAccessToken({ user });
  }

  logOut(context: IContext): string {
    context.res.setHeader(
      'set-Cookie',
      `refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`,
    );

    return '로그아웃 되었습니다.';
  }

  setRefreshTokenByRestAPI({
    user,
    res,
  }: IAuthServiceSetRefreshTokenByRestAPI): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: '리프레시비밀번호', expiresIn: '2w' },
    );

    res.setHeader(
      'set-Cookie', //
      `refreshToken=${refreshToken}; path=/;`,
    );
  }
}
