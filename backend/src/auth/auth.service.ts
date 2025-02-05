import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  }

  async login(provider: string, accessToken: string) {
    if (provider === 'google') {
      const payload = await this.verifyGoogleToken(accessToken);
      const user = await this.usersService.findOrCreate({
        email: payload.email,
        provider: 'google',
        providerId: payload.sub,
      });

      const jwtPayload = { email: user.email, sub: user.providerId };
      return {
        access_token: this.jwtService.sign(jwtPayload),
      };
    }
    throw new Error('Unsupported provider');
  }
}