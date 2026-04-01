"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let ChatGateway = class ChatGateway {
    chatService;
    jwtService;
    config;
    server;
    constructor(chatService, jwtService, config) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.config = config;
    }
    afterInit() {
        console.log('WebSocket gateway initialized');
    }
    handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (token) {
                const payload = this.jwtService.verify(token, { secret: this.config.get('JWT_SECRET') });
                client.data.user = payload;
            }
        }
        catch {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoin(client, data) {
        client.join(`conv_${data.conversationId}`);
        return { event: 'joined', data: data.conversationId };
    }
    async handleMessage(client, data) {
        const user = client.data.user;
        if (!user)
            return;
        const result = await this.chatService.sendMessage(data.conversationId, user.sub, data.content);
        this.server.to(`conv_${data.conversationId}`).emit('new_message', {
            senderId: user.sub,
            content: data.content,
            isBot: false,
            createdAt: new Date(),
        });
        if (result.message) {
            this.server.to(`conv_${data.conversationId}`).emit('new_message', result.message);
        }
        if (result.status === 'escalated') {
            this.server.emit('queue_updated');
        }
        return result;
    }
    async handleClaim(client, data) {
        const user = client.data.user;
        if (!user)
            return;
        const conv = await this.chatService.claimConversation(data.conversationId, user.sub);
        client.join(`conv_${data.conversationId}`);
        this.server.to(`conv_${data.conversationId}`).emit('conversation_updated', conv);
        this.server.emit('queue_updated');
        return conv;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('claim_conversation'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleClaim", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map