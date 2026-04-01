import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostCategory } from '../generated/prisma';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: PostCategory) {
    return this.prisma.post.findMany({
      where: { published: true, ...(category ? { category } : {}) },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto, authorId: string) {
    return this.prisma.post.create({
      data: { ...dto, authorId },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
    });
  }

  async like(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
    });
  }

  async delete(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
