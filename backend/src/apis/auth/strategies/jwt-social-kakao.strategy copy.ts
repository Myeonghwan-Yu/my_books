import { PassportStrategy } from '@nestjs/passport';
import { randomBytes } from 'crypto';
import { Strategy, Profile } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
      scope: ['account_email', 'profile_nickname'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile._json);

    const generatedPassword = randomBytes(16).toString('hex');

    return {
      name: profile.displayName,
      email: profile._json.kakao_account.email,
      password: generatedPassword,
      age: 0,
    };
  }
}
