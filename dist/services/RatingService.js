"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RatingService {
    // Cria uma nova classificação
    async createRating(eventId, userId, score, comment) {
        return await prisma.rating.create({
            data: {
                eventId,
                userId,
                score,
                comment,
            },
        });
    }
    // Obtem todas as classificações
    async getAllRatings() {
        return await prisma.rating.findMany({
            include: {
                user: true, // Inclui informações do usuário
                event: true // Inclui informações do evento
            }
        });
    }
    // Obtem uma classificação por ID
    async getRatingById(id) {
        return await prisma.rating.findUnique({
            where: { id },
            include: {
                user: true,
                event: true
            }
        });
    }
    // Atualiza uma classificação
    async updateRating(id, eventId, userId, score, comment) {
        return await prisma.rating.update({
            where: { id },
            data: {
                eventId,
                userId,
                score,
                comment,
            },
        });
    }
    // Deleta uma classificação
    async deleteRating(id) {
        return await prisma.rating.delete({
            where: { id },
        });
    }
}
exports.RatingService = RatingService;
//# sourceMappingURL=RatingService.js.map