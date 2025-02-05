// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  // Create a new post
  async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersService.findByProviderId(userId);
    const post = this.postRepository.create({
      ...createPostDto,
      user,
    });
    return this.postRepository.save(post);
  }

  // Find all posts for a specific user
  async findAll(userId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { user: { providerId: userId } },
      relations: ['user'],
    });
  }

  // Find a specific post by ID
  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: Number(id) },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}