import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private chatService;
    private jwtService;
    private config;
    server: Server;
    constructor(chatService: ChatService, jwtService: JwtService, config: ConfigService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoin(client: Socket, data: {
        conversationId: string;
    }): {
        event: string;
        data: string;
    };
    handleMessage(client: Socket, data: {
        conversationId: string;
        content: string;
    }): Promise<{
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
    } | undefined>;
    handleClaim(client: Socket, data: {
        conversationId: string;
    }): Promise<({
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
    }) | undefined>;
}
