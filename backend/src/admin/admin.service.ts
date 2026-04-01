import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [userCount, postCount, conversationCount, queuedCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.conversation.count(),
      this.prisma.conversation.count({ where: { status: 'QUEUED' } }),
    ]);

    const byRole = await this.prisma.user.groupBy({ by: ['role'], _count: { id: true } });

    const recentConversations = await this.prisma.conversation.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        student: { select: { name: true, email: true } },
        collaborator: { select: { name: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });

    return {
      users: { total: userCount, byRole },
      posts: postCount,
      conversations: { total: conversationCount, queued: queuedCount },
      recentConversations,
    };
  }

  async getFaqEntries() {
    return this.prisma.faqEntry.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async createFaqEntry(data: { question: string; answer: string; keywords: string[]; category?: string }) {
    return this.prisma.faqEntry.create({ data });
  }

  async deleteFaqEntry(id: string) {
    return this.prisma.faqEntry.delete({ where: { id } });
  }
}
