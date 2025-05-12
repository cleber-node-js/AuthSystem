import { PrismaClient, UserPreference } from '@prisma/client';

const prisma = new PrismaClient();

export class UserPreferenceService {

    async getPreferencesByuser_id(user_id: number): Promise<UserPreference | null> {
        const userPreference = await prisma.userPreference.findFirst({
            where: { user_id }, // Buscar por user_id usando findFirst
        });
        return userPreference;
    }

    async createPreferences(
        user_id: number,
        interests: string,
        favoriteCategories: string
    ): Promise<UserPreference> {
        return prisma.userPreference.create({
            data: {
                user_id,
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
