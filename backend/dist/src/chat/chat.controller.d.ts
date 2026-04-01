import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getConversations(user: any): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            content: string;
            isBot: boolean;
            isSystem: boolean;
            conversationId: string;
            senderId: string | null;
        }[];
        collaborator: {
            id: string;
            name: string;
            avatarUrl: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("src/generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    })[]>;
    start(user: any): Promise<{
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
            id: string;
            name: string;
        };
        collaborator: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("src/generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    }>;
    getQueue(): Promise<({
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
            id: string;
            name: string;
            enrollment: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("src/generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    })[]>;
    getOne(id: string): Promise<{
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
            id: string;
            name: string;
        };
        collaborator: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("src/generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    }>;
    close(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("src/generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    }>;
}
