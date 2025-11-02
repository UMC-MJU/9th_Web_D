import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';
import googleOauthConfig from 'src/auth/config/google-oauth-config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientId as string,
      clientSecret: googleConfig.clientSecret as string,
      callbackURL: googleConfig.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      displayName: string;
      emails: { value: string }[];
      photos: { value: string }[];
    },
    done: VerifyCallback,
  ) {
    const user = await this.authService.validateGoogleUser({
      email: profile?.emails[0].value,
      name: profile.displayName,
      password: '',
      avatar: profile.photos[0].value,
    });

    done(null, user);
  }
}
