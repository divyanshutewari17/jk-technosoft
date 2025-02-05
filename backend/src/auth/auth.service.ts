import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios'; // For validating Facebook tokens

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  // Verify Google ID token
  async verifyGoogleToken(token: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  }

  // Verify Facebook access token
  async verifyFacebookToken(accessToken: string) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/me?fields=id,email,name&access_token=${accessToken}`,
      );
      return response.data; // Returns user profile data
    } catch (error) {
      throw new Error('Invalid Facebook token');
    }
  }

  // Handle login for both Google and Facebook
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
    } else if (provider === 'facebook') {
      const profile = await this.verifyFacebookToken(accessToken);
      const user = await this.usersService.findOrCreate({
        email: profile.email,
        provider: 'facebook',
        providerId: profile.id,
      });

      const jwtPayload = { email: user.email, sub: user.providerId };
      return {
        access_token: this.jwtService.sign(jwtPayload),
      };
    } else {
      throw new Error('Unsupported provider');
    }
  }
}