import { PassportStrategy } from '@nestjs/passport';
import { randomBytes } from 'crypto';
import { Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientId: '',
      clientSecret: '',
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    const generatedPassword = randomBytes(16).toString('hex');

    return {
      name: profile.displayName,
      email: profile.emails[0].value,
      password: generatedPassword,
      age: 0,
    };
  }
}
