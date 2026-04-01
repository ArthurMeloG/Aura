"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("../src/generated/prisma");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcryptjs"));
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new prisma_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Seeding database...');
    const adminPwd = await bcrypt.hash('admin123', 10);
    const collabPwd = await bcrypt.hash('colab123', 10);
    const studentPwd = await bcrypt.hash('student123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@university.edu' },
        update: {},
        create: { name: 'Admin Sistema', email: 'admin@university.edu', password: adminPwd, role: prisma_1.Role.ADMIN },
    });
    const collab = await prisma.user.upsert({
        where: { email: 'secretaria@university.edu' },
        update: {},
        create: { name: 'Ana Paula (Secretaria)', email: 'secretaria@university.edu', password: collabPwd, role: prisma_1.Role.COLLABORATOR },
    });
    const student = await prisma.user.upsert({
        where: { email: 'aluno@university.edu' },
        update: {},
        create: { name: 'Carlos Eduardo', email: 'aluno@university.edu', password: studentPwd, role: prisma_1.Role.STUDENT, enrollment: '202344091' },
    });
    await prisma.post.createMany({
        skipDuplicates: true,
        data: [
            {
                id: 'post-1',
                title: 'Novas bolsas de intercâmbio para 2024: Inscrições abertas',
                content: 'A Reitoria anuncia a abertura de 50 vagas para mobilidade acadêmica internacional em parceria com universidades europeias.',
                category: prisma_1.PostCategory.EDITAL,
                authorId: admin.id,
                likesCount: 124,
            },
            {
                id: 'post-2',
                title: 'Simpósio de Inteligência Artificial e Ética no Campus Central',
                content: 'Participe do debate com especialistas globais sobre o futuro da educação na era dos algoritmos. Certificado incluso.',
                category: prisma_1.PostCategory.EVENTO,
                authorId: admin.id,
                likesCount: 87,
            },
            {
                id: 'post-3',
                title: 'Manutenção Preventiva no Portal Acadêmico',
                content: 'O sistema ficará indisponível neste domingo das 08h às 12h para atualização de servidores.',
                category: prisma_1.PostCategory.AVISO,
                authorId: collab.id,
                likesCount: 12,
            },
            {
                id: 'post-4',
                title: 'Espaços de Co-working abertos 24h durante o período de provas',
                content: 'Para apoiar os estudantes no período de avaliações, os espaços de co-working estarão disponíveis 24 horas por dia.',
                category: prisma_1.PostCategory.ACADEMICO,
                authorId: admin.id,
                likesCount: 202,
            },
        ],
    });
    await prisma.faqEntry.createMany({
        skipDuplicates: true,
        data: [
            {
                question: 'Quando é o período de matrículas?',
                answer: 'O período de matrícula é divulgado no portal acadêmico com antecedência mínima de 15 dias letivos.',
                keywords: ['matrícula', 'matricula', 'período', 'prazo'],
                category: 'academico',
            },
            {
                question: 'Como acessar meu histórico escolar?',
                answer: 'O histórico escolar é emitido pelo portal acadêmico em "Documentos > Histórico". Leva até 5 dias úteis para atualizar após lançamento de notas.',
                keywords: ['histórico', 'historico', 'nota', 'boletim'],
                category: 'academico',
            },
            {
                question: 'Como renovar um livro da biblioteca?',
                answer: 'A renovação pode ser feita diretamente pelo portal da biblioteca (biblioteca.university.edu) ou presencialmente no balcão de atendimento.',
                keywords: ['biblioteca', 'livro', 'renovar', 'renovação', 'empréstimo'],
                category: 'biblioteca',
            },
            {
                question: 'Qual é o horário da secretaria?',
                answer: 'A secretaria funciona de segunda a sexta-feira das 8h às 18h e aos sábados das 8h às 12h.',
                keywords: ['secretaria', 'horário', 'atendimento', 'funcionamento'],
                category: 'secretaria',
            },
            {
                question: 'Como solicitar certificado ou declaração?',
                answer: 'Documentos como certificados e declarações podem ser solicitados pelo portal acadêmico em "Requerimentos". O prazo de emissão é de 5 dias úteis.',
                keywords: ['certificado', 'declaração', 'declaracao', 'documento', 'requerimento'],
                category: 'documentos',
            },
        ],
    });
    console.log('✅ Seed complete!');
    console.log('Users seeded:');
    console.log('  admin@university.edu | password: admin123');
    console.log('  secretaria@university.edu | password: colab123');
    console.log('  aluno@university.edu | password: student123');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map