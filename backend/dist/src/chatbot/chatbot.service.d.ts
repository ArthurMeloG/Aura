import { PrismaService } from '../prisma/prisma.service';
export declare class ChatbotService {
    private prisma;
    constructor(prisma: PrismaService);
    respond(question: string): Promise<{
        answer: string;
        confident: boolean;
    }>;
    shouldEscalate(text: string): boolean;
}
