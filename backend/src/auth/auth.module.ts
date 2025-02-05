import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register Passport with the JWT strategy
    JwtModule.register({
      secretOrPrivateKey: 'jfhksaghjfsa', // Use the same secret key as in JwtStrategy
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    UsersModule, // Import the UsersModule to use UsersService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Register JwtStrategy as a provider
  exports: [JwtStrategy, PassportModule], // Export JwtStrategy and PassportModule
})
export class AuthModule {}