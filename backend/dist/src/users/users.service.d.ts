import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("src/generated/prisma").$Enums.Role;
        enrollment: string | null;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        role: import("src/generated/prisma").$Enums.Role;
        enrollment: string | null;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("src/generated/prisma").$Enums.Role;
        enrollment: string | null;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("src/generated/prisma").$Enums.Role;
        enrollment: string | null;
        createdAt: Date;
    }[]>;
}
