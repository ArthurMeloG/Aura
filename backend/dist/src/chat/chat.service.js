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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const chatbot_service_1 = require("../chatbot/chatbot.service");
const prisma_1 = require("../generated/prisma");
let ChatService = class ChatService {
    prisma;
    chatbot;
    constructor(prisma, chatbot) {
        this.prisma = prisma;
        this.chatbot = chatbot;
    }
    async getConversations(userId) {
        return this.prisma.conversation.findMany({
            where: { studentId: userId },
            include: {
                messages: { take: 1, orderBy: { createdAt: 'desc' } },
                collaborator: { select: { id: true, name: true, avatarUrl: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getConversation(id) {
        const conv = await this.prisma.conversation.findUnique({
            where: { id },
            include: {
                messages: { orderBy: { createdAt: 'asc' } },
                collaborator: { select: { id: true, name: true } },
                student: { select: { id: true, name: true } },
            },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        return conv;
    }
    async startConversation(studentId) {
        const conv = await this.prisma.conversation.create({
            data: {
                studentId,
                status: prisma_1.ConversationStatus.BOT,
            },
        });
        await this.prisma.message.create({
            data: {
                conversationId: conv.id,
                content: 'Olá! Sou o Assistente Virtual da University Excellence. Posso te ajudar com dúvidas sobre matrículas, horários ou documentos. Como posso auxiliar hoje?',
                isBot: true,
            },
        });
        return this.getConversation(conv.id);
    }
    async sendMessage(conversationId, senderId, content) {
        const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        await this.prisma.message.create({
            data: { conversationId, senderId, content, isBot: false },
        });
        await this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
        if (conv.status === prisma_1.ConversationStatus.BOT) {
            if (this.chatbot.shouldEscalate(content)) {
                await this.prisma.conversation.update({
                    where: { id: conversationId },
                    data: { status: prisma_1.ConversationStatus.QUEUED },
                });
                const systemMsg = await this.prisma.message.create({
                    data: {
                        conversationId,
                        content: 'Você foi adicionado à fila de atendimento. Um colaborador irá atendê-lo em breve. Tempo estimado: 2-5 minutos.',
                        isBot: true,
                        isSystem: true,
                    },
                });
                return { status: 'escalated', message: systemMsg };
            }
            const { answer } = await this.chatbot.respond(content);
            const botMsg = await this.prisma.message.create({
                data: { conversationId, content: answer, isBot: true },
            });
            return { status: 'bot', message: botMsg };
        }
        return { status: 'human', message: null };
    }
    async getQueue() {
        return this.prisma.conversation.findMany({
            where: { status: prisma_1.ConversationStatus.QUEUED },
            include: { student: { select: { id: true, name: true, enrollment: true } }, messages: { take: 1, orderBy: { createdAt: 'desc' } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async claimConversation(conversationId, collaboratorId) {
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { collaboratorId, status: prisma_1.ConversationStatus.ACTIVE },
        });
        await this.prisma.message.create({
            data: {
                conversationId,
                content: `Um colaborador entrou no chat e irá continuar seu atendimento.`,
                isBot: true,
                isSystem: true,
            },
        });
        return this.getConversation(conversationId);
    }
    async closeConversation(id) {
        return this.prisma.conversation.update({
            where: { id },
            data: { status: prisma_1.ConversationStatus.CLOSED },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chatbot_service_1.ChatbotService])
], ChatService);
//# sourceMappingURL=chat.service.js.map