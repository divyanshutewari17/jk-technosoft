import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
) {
    super({
      clientID: '470400006130560',
      clientSecret: '3aa9eca2a1ddfdf3e922b14b5d3c3238', 
      callbackURL: 'http://localhost:3005/auth/facebook/callback', // Callback URL
      profileFields: ['id', 'emails', 'name'], // Fields to fetch from Facebook
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any) => void,
  ) {
    const { id, emails, name } = profile;
    const user = {
      email: emails?.[0]?.value, // Use the first email
      provider: 'facebook',
      providerId: id,
      firstName: name?.givenName,
      lastName: name?.familyName,
    };

    // Save or retrieve the user from your database
    const validatedUser = await this.userService.findOrCreate(user);
    done(null, validatedUser);
  }
}