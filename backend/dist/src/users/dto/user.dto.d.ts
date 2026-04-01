import { Role } from '../../generated/prisma';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: Role;
    enrollment?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
