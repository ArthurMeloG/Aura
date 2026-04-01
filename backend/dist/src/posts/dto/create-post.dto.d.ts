import { PostCategory } from '../../generated/prisma';
export declare class CreatePostDto {
    title: string;
    content: string;
    category?: PostCategory;
    imageUrl?: string;
}
