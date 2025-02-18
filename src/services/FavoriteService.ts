import { PrismaClient, Favorite } from '@prisma/client';

const prisma = new PrismaClient();

export class FavoriteService {
    async addFavorite(userId: number, eventId: number): Promise<Favorite> {
        return await prisma.favorite.create({
            data: {
                userId,
                eventId
            }
        });
    }

    async getFavoritesByUser(userId: number): Promise<Favorite[]> {
        return await prisma.favorite.findMany({
            where: {
                userId
            },
            include: {
                Event: true,  // Incluindo informações do evento, se necessário
            }
        });
    }

    async removeFavorite(favoriteId: number): Promise<Favorite> {
        return await prisma.favorite.delete({
            where: { id: favoriteId }
        });
    }

    async checkFavorite(userId: number, eventId: number): Promise<Favorite | null> {
        return await prisma.favorite.findFirst({
            where: {
                userId: userId,
                eventId: eventId
            }
        });
    }        

    // Novo método para buscar todos os favoritos
    async getAllFavorites(): Promise<Favorite[]> {
        return await prisma.favorite.findMany({
            include: {
                Event: true,  // Opcional: incluir detalhes dos eventos favoritos
            }
        });
    }
}
