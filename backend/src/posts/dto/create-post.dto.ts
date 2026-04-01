import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { PostCategory } from '../../generated/prisma';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(PostCategory)
  category?: PostCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
