import { PrismaClient, Favorite } from '@prisma/client';

const prisma = new PrismaClient();

export class FavoriteService {
    async addFavorite(user_id: number, event_id: number): Promise<Favorite> {
        return await prisma.favorite.create({
            data: {
                user_id,
                event_id
            }
        });
    }

    async getFavoritesByUser(user_id: number): Promise<Favorite[]> {
        return await prisma.favorite.findMany({
            where: {
                user_id
            },
            include: {
                event: true,  // Incluindo informações do evento, se necessário
            }
        });
    }

    async removeFavorite(favoriteId: number): Promise<Favorite> {
        return await prisma.favorite.delete({
            where: { id: favoriteId }
        });
    }

    async checkFavorite(user_id: number, event_id: number): Promise<Favorite | null> {
        return await prisma.favorite.findFirst({
            where: {
                user_id: user_id,
                event_id: event_id
            }
        });
    }        

    // Novo método para buscar todos os favoritos
    async getAllFavorites(): Promise<Favorite[]> {
        return await prisma.favorite.findMany({
            include: {
                event: true,  // Opcional: incluir detalhes dos eventos favoritos
            }
        });
    }
}
