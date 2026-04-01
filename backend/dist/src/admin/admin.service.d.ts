import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getMetrics(): Promise<{
        users: {
            total: number;
            byRole: (import("src/generated/prisma").Prisma.PickEnumerable<import("src/generated/prisma").Prisma.UserGroupByOutputType, "role"[]> & {
                _count: {
                    id: number;
                };
            })[];
        };
        posts: number;
        conversations: {
            total: number;
            queued: number;
        };
        recentConversations: ({
            messages: {
                id: string;
                createdAt: Date;
                content: string;
                isBot: boolean;
                isSystem: boolean;
                conversationId: string;
                senderId: string | null;
            }[];
            student: {
                email: string;
                name: string;
            };
            collaborator: {
                name: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("src/generated/prisma").$Enums.ConversationStatus;
            studentId: string;
            collaboratorId: string | null;
        })[];
    }>;
    getFaqEntries(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        question: string;
        answer: string;
        keywords: string[];
        active: boolean;
    }[]>;
    createFaqEntry(data: {
        question: string;
        answer: string;
        keywords: string[];
        category?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        question: string;
        answer: string;
        keywords: string[];
        active: boolean;
    }>;
    deleteFaqEntry(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        question: string;
        answer: string;
        keywords: string[];
        active: boolean;
    }>;
}
