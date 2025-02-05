import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = { title: 'Test Post', body: 'Test Body' };
      const user = { id: 1, providerId: '123', email: 'test@example.com' } as User;
      const post = { id: 1, ...createPostDto, user } as Post;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(postRepository, 'create').mockReturnValue(post);
      jest.spyOn(postRepository, 'save').mockResolvedValue(post);

      const result = await service.create('123', createPostDto);
      expect(result).toEqual(post);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const posts = [{ id: 1, title: 'Test Post', body: 'Test Body' }] as Post[];
      jest.spyOn(postRepository, 'find').mockResolvedValue(posts);

      const result = await service.findAll('123');
      expect(result).toEqual(posts);
    });
  });
});