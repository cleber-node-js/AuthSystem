"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FavoriteService {
    async addFavorite(userId, eventId) {
        return await prisma.favorite.create({
            data: {
                userId,
                eventId
            }
        });
    }
    async getFavoritesByUser(userId) {
        return await prisma.favorite.findMany({
            where: {
                userId
            },
            include: {
                Event: true, // Incluindo informações do evento, se necessário
            }
        });
    }
    async removeFavorite(favoriteId) {
        return await prisma.favorite.delete({
            where: { id: favoriteId }
        });
    }
    async checkFavorite(userId, eventId) {
        return await prisma.favorite.findFirst({
            where: {
                userId: userId,
                eventId: eventId
            }
        });
    }
    // Novo método para buscar todos os favoritos
    async getAllFavorites() {
        return await prisma.favorite.findMany({
            include: {
                Event: true, // Opcional: incluir detalhes dos eventos favoritos
            }
        });
    }
}
exports.FavoriteService = FavoriteService;
//# sourceMappingURL=FavoriteService.js.map