import { PrismaService } from '../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
export declare class ChatService {
    private prisma;
    private chatbot;
    constructor(prisma: PrismaService, chatbot: ChatbotService);
    getConversations(userId: string): Promise<({
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
        status: import("../generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    })[]>;
    getConversation(id: string): Promise<{
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
        status: import("../generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    }>;
    startConversation(studentId: string): Promise<{
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
        status: import("../generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    }>;
    sendMessage(conversationId: string, senderId: string, content: string): Promise<{
        status: string;
        message: {
            id: string;
            createdAt: Date;
            content: string;
            isBot: boolean;
            isSystem: boolean;
            conversationId: string;
            senderId: string | null;
        };
    } | {
        status: string;
        message: null;
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
        status: import("../generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    })[]>;
    claimConversation(conversationId: string, collaboratorId: string): Promise<{
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
        status: import("../generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    }>;
    closeConversation(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma").$Enums.ConversationStatus;
        studentId: string;
        collaboratorId: string | null;
    }>;
}
