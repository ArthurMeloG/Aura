import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { ConversationStatus } from '../generated/prisma';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private chatbot: ChatbotService,
  ) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: { studentId: userId },
      include: {
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
        collaborator: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        collaborator: { select: { id: true, name: true } },
        student: { select: { id: true, name: true } },
      },
    });
    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async startConversation(studentId: string) {
    const conv = await this.prisma.conversation.create({
      data: {
        studentId,
        status: ConversationStatus.BOT,
      },
    });
    // Send welcome message
    await this.prisma.message.create({
      data: {
        conversationId: conv.id,
        content: 'Olá! Sou o Assistente Virtual da University Excellence. Posso te ajudar com dúvidas sobre matrículas, horários ou documentos. Como posso auxiliar hoje?',
        isBot: true,
      },
    });
    return this.getConversation(conv.id);
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');

    // Save user message
    await this.prisma.message.create({
      data: { conversationId, senderId, content, isBot: false },
    });

    // Update updatedAt
    await this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });

    if (conv.status === ConversationStatus.BOT) {
      // Check for escalation
      if (this.chatbot.shouldEscalate(content)) {
        await this.prisma.conversation.update({
          where: { id: conversationId },
          data: { status: ConversationStatus.QUEUED },
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

      // Bot responds
      const { answer } = await this.chatbot.respond(content);
      const botMsg = await this.prisma.message.create({
        data: { conversationId, content: answer, isBot: true },
      });
      return { status: 'bot', message: botMsg };
    }

    // Human conversation — just saved the message
    return { status: 'human', message: null };
  }

  async getQueue() {
    return this.prisma.conversation.findMany({
      where: { status: ConversationStatus.QUEUED },
      include: { student: { select: { id: true, name: true, enrollment: true } }, messages: { take: 1, orderBy: { createdAt: 'desc' } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async claimConversation(conversationId: string, collaboratorId: string) {
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { collaboratorId, status: ConversationStatus.ACTIVE },
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

  async closeConversation(id: string) {
    return this.prisma.conversation.update({
      where: { id },
      data: { status: ConversationStatus.CLOSED },
    });
  }
}
