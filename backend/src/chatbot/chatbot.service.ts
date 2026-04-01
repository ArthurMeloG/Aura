import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  async respond(question: string): Promise<{ answer: string; confident: boolean }> {
    const faqs = await this.prisma.faqEntry.findMany({ where: { active: true } });
    const q = question.toLowerCase();

    // Keyword matching with scoring
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

    // Fallback patterns
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

  shouldEscalate(text: string): boolean {
    const escalationPhrases = ['atendente', 'humano', 'secretaria', 'colaborador', 'falar com alguém', 'pessoa'];
    return escalationPhrases.some((p) => text.toLowerCase().includes(p));
  }
}
