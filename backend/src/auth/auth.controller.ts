import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Route prefix: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // POST /auth/login
  async login(@Body('provider') provider: string, @Body('accessToken') accessToken: string) {
    return this.authService.login(provider, accessToken);
  }
}