import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req) {
    return this.postsService.findAll(req.user.providerId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.providerId, createPostDto);
  }

  @Get('/:id')
@UseGuards(AuthGuard('jwt'))
async getPosts(@Req() req, @Param('id') id: string) {
  return this.postsService.findOne(id);
}
}