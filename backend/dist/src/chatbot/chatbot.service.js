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
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatbotService = class ChatbotService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async respond(question) {
        const faqs = await this.prisma.faqEntry.findMany({ where: { active: true } });
        const q = question.toLowerCase();
        let bestMatch = { answer: '', score: 0 };
        for (const faq of faqs) {
            const keywords = faq.keywords.map((k) => k.toLowerCase());
            const score = keywords.filter((k) => q.includes(k)).length;
            if (score > bestMatch.score) {
                bestMatch = { answer: faq.answer, score };
            }
        }
        if (bestMatch.score >= 2) {
            return { answer: bestMatch.answer, confident: true };
        }
        if (q.includes('matrícula') || q.includes('matricula')) {
            return { answer: 'O período de matrícula é divulgado no portal acadêmico com antecedência mínima de 15 dias.', confident: true };
        }
        if (q.includes('horário') || q.includes('aula')) {
            return { answer: 'Os horários das aulas estão disponíveis no portal acadêmico na seção "Grade Horária".', confident: true };
        }
        if (q.includes('histórico') || q.includes('nota')) {
            return { answer: 'O histórico escolar é atualizado em até 5 dias úteis após o lançamento de notas pelo docente.', confident: true };
        }
        if (q.includes('bolsa') || q.includes('financiamento') || q.includes('fies') || q.includes('prouni')) {
            return { answer: 'Informações sobre bolsas e financiamentos estão disponíveis na Diretoria Financeira, ramal 1042.', confident: true };
        }
        if (q.includes('biblioteca') || q.includes('livro') || q.includes('renovação')) {
            return { answer: 'A renovação de empréstimos pode ser feita pelo portal da biblioteca ou presencialmente.', confident: true };
        }
        return {
            answer: 'Não encontrei uma resposta precisa para isso. Prefere que eu conecte você com um atendente da secretaria?',
            confident: false,
        };
    }
    shouldEscalate(text) {
        const escalationPhrases = ['atendente', 'humano', 'secretaria', 'colaborador', 'falar com alguém', 'pessoa'];
        return escalationPhrases.some((p) => text.toLowerCase().includes(p));
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map