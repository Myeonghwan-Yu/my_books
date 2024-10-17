import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        console.log(req);
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken', '');
        return refreshToken;
      },
      secretOrKey: '나의리프레시비밀번호',
    });
  }

  validate(payload) {
    console.log(payload);
    return {
      id: payload.sub,
    };
  }
}
