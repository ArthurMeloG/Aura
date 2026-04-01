import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostCategory } from '../generated/prisma';
export declare class PostsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(category?: PostCategory): Promise<({
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        category: import("../generated/prisma").$Enums.PostCategory;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        likesCount: number;
    })[]>;
    findOne(id: string): Promise<{
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        category: import("../generated/prisma").$Enums.PostCategory;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        likesCount: number;
    }>;
    create(dto: CreatePostDto, authorId: string): Promise<{
        author: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        category: import("../generated/prisma").$Enums.PostCategory;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        likesCount: number;
    }>;
    like(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        category: import("../generated/prisma").$Enums.PostCategory;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        likesCount: number;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        category: import("../generated/prisma").$Enums.PostCategory;
        imageUrl: string | null;
        published: boolean;
        authorId: string;
        likesCount: number;
    }>;
}
