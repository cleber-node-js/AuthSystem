import { PrismaClient, UserPreference } from '@prisma/client';

const prisma = new PrismaClient();

export class UserPreferenceService {

    async getPreferencesByUserId(userId: number): Promise<UserPreference | null> {
        const userPreference = await prisma.userPreference.findFirst({
            where: { userId }, // Buscar por userId usando findFirst
        });
        return userPreference;
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
        id: number,
        data: Partial<Omit<UserPreference, 'id' | 'createdAt'>>,
    ): Promise<UserPreference | null> {
        return prisma.userPreference.update({
            where: { id }, // Usando id para a chave única
            data,
        });
    }

    async deletePreferences(id: number): Promise<void> { // Retorna void, pois não precisa retornar a preferencia deletada.
        await prisma.userPreference.delete({
            where: { id }, // Usando id para a chave única
        });
    }
}
