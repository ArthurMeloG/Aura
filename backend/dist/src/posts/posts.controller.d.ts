import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostCategory } from '../generated/prisma';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
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
    create(dto: CreatePostDto, user: any): Promise<{
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
