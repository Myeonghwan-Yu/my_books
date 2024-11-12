import { PassportStrategy } from '@nestjs/passport';
import { randomBytes } from 'crypto';
import { Strategy, Profile } from 'passport-naver-v2';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      scope: ['email', 'name'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    const generatedPassword = randomBytes(16).toString('hex');

    return {
      name: profile.name,
      email: profile.email,
      password: generatedPassword,
      age: 0,
    };
  }
}
