import { PrismaClient, Classification } from '@prisma/client';

const prisma = new PrismaClient();

export class ClassificationService {
    // Adiciona uma nova classificação
    async createClassification(user_id: number, event_id: number, score: number, comment?: string): Promise<Classification> {
        return await prisma.classification.create({
            data: {
                user_id,
                event_id,
                score,
                comment
            }
        });
    }

    // Obtém todas as classificações
    async getAllClassifications(): Promise<Classification[]> {
        return await prisma.classification.findMany({
            include: {
                user: true,  // Inclui informações do usuário
                event: true, // Inclui informações do evento
            }
        });
    }

    // Obtém uma classificação por ID
    async getClassificationById(id: number): Promise<Classification | null> {
        return await prisma.classification.findUnique({
            where: { id },
            include: {
                user: true,
                event: true,
            }
        });
    }

    // Atualiza uma classificação
    async updateClassification(id: number, user_id: number, event_id: number, score: number, comment?: string): Promise<Classification> {
        return await prisma.classification.update({
            where: { id },
            data: {
                user_id,
                event_id,
                score,
                comment
            }
        });
    }

    // Deleta uma classificação
    async deleteClassification(id: number): Promise<Classification> {
        return await prisma.classification.delete({
            where: { id },
        });
    }
}