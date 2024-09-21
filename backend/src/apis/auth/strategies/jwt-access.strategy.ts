import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '나의비밀번호',
    });
  }

  // 검사하고
  // 성공하면 밸리데이트로 내려옮
  // 페이로드에 들어가는건
  // payload : {sub : adsfjkl (userID)}

  validate(payload) {
    console.log(payload);
    return {
      id: payload.sub,
    };
  }
}
