import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { JwtNaverStrategy } from './strategies/jwt-social-naver.strategy';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';
import { JwtKakaoStrategy } from './strategies/jwt-social-kakao.strategy copy';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, //
  ],

  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthResolver,
    AuthService,
    JwtGoogleStrategy,
    JwtKakaoStrategy,
    JwtNaverStrategy,
  ],

  controllers: [
    AuthController, //
  ],
})
export class AuthModule {}
