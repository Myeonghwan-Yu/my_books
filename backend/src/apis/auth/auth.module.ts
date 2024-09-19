import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, //
  ],

  providers: [
    AuthResolver, //
    AuthService,
    UsersService,
  ],
})
export class AuthModule {}
