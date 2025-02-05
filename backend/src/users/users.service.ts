import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Find a user by their provider ID (Google/Facebook ID)
  async findByProviderId(providerId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { providerId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Create a new user
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  // Find or create a user based on provider ID
  async findOrCreate(userData: Partial<User>): Promise<User> {
    try {
      return await this.findByProviderId(userData.providerId);
    } catch (error) {
      return this.create(userData);
    }
  }
}