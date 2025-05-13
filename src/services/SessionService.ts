import { PrismaClient, Session } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class SessionService {
    // Criar uma nova sessão
    public async createSession(user_id: number): Promise<Session> {
        const sessionToken = crypto.randomBytes(32).toString('hex'); // Gera um token seguro e aleatório

        // Verificar se o sessionToken já existe
        const existingSession = await prisma.session.findUnique({
            where: { sessionToken },
        });

        if (existingSession) {
            throw new Error('Session token already exists.');
        }

        // Criar uma nova sessão
        return await prisma.session.create({
            data: {
                user_id,
                sessionToken,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }

    // Obter todas as sessões
    public async getAllSessions(): Promise<Session[]> {
        return await prisma.session.findMany();
    }

    // Obter uma sessão por ID
    public async getSessionById(id: number): Promise<Session | null> {
        return await prisma.session.findUnique({ where: { id } });
    }

    // Atualizar uma sessão
    public async updateSession(id: number, sessionData: Partial<Session>): Promise<Session | null> {
        return await prisma.session.update({ where: { id }, data: sessionData });
    }

    // Deletar uma sessão
    public async deleteSession(id: number): Promise<Session | null> {
        return await prisma.session.delete({ where: { id } });
    }
}
