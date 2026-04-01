import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
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
    getFaq(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        question: string;
        answer: string;
        keywords: string[];
        active: boolean;
    }[]>;
    createFaq(body: {
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
    deleteFaq(id: string): Promise<{
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
