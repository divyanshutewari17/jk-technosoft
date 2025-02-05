import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  provider: string; // 'google' or 'facebook'

  @Column()
  providerId: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}