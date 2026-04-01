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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async createFaqEntry(data) {
        return this.prisma.faqEntry.create({ data });
    }
    async deleteFaqEntry(id) {
        return this.prisma.faqEntry.delete({ where: { id } });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map