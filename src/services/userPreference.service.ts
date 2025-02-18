// src/services/userPreference.service.ts
import { PrismaClient, UserPreference } from '@prisma/client';

const prisma = new PrismaClient();

export class UserPreferenceService {

    async getPreferencesByUserId(userId: number): Promise<UserPreference | null> {
        return prisma.userPreference.findUnique({
            where: { userId }, // Corrigido para buscar por userId
        });
    }

    async createPreferences(
        userId: number,
        interests: string,
        favoriteCategories: string
    ): Promise<UserPreference> {
        return prisma.userPreference.create({
            data: {
                userId,
                interests,
                favoriteCategories,
            },
        });
    }

    async updatePreferences(
        userId: number,
        data: Partial<Omit<UserPreference, 'id' | 'createdAt'>>,
    ): Promise<UserPreference | null> {
        return prisma.userPreference.update({
            where: { userId },
            data,
        });
    }

    async deletePreferences(userId: number): Promise<void> { // Retorna void, pois não precisa retornar a preferencia deletada.
        await prisma.userPreference.delete({
            where: { userId },
        });
    }
}