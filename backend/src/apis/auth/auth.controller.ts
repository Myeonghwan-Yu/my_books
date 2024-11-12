import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard';
import { Request, Response } from 'express';
import { IOAuthUser } from 'src/commons/interfaces/context';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login/:social')
  @UseGuards(DynamicAuthGuard)
  async loginOAuth(
    @Req() req: Request & IOAuthUser, //
    @Res() res: Response,
  ) {
    return this.authService.loginOAuth({ req, res });
  }
}
