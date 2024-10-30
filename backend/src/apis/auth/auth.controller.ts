import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

interface IOAuthUser {
  user: {
    name: string;
    email: string;
    password: string;
    age: number;
  };
}

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService, //
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('google'))
  @Get('/login/google')
  async loginGoogle(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
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

      this.authService.setRefreshTokenByRestAPI({ user, res });

      res.redirect('http://localhost:5500/frontend/social-login.html');
    }
  }
}
