"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ClassificationService {
    // Adiciona uma nova classificação
    async createClassification(userId, eventId, score, comment) {
        return await prisma.classification.create({
            data: {
                userId,
                eventId,
                score,
                comment
            }
        });
    }
    // Obtém todas as classificações
    async getAllClassifications() {
        return await prisma.classification.findMany({
            include: {
                user: true, // Inclui informações do usuário
                event: true, // Inclui informações do evento
            }
        });
    }
    // Obtém uma classificação por ID
    async getClassificationById(id) {
        return await prisma.classification.findUnique({
            where: { id },
            include: {
                user: true,
                event: true,
            }
        });
    }
    // Atualiza uma classificação
    async updateClassification(id, userId, eventId, score, comment) {
        return await prisma.classification.update({
            where: { id },
            data: {
                userId,
                eventId,
                score,
                comment
            }
        });
    }
    // Deleta uma classificação
    async deleteClassification(id) {
        return await prisma.classification.delete({
            where: { id },
        });
    }
}
exports.ClassificationService = ClassificationService;
//# sourceMappingURL=ClassificationService.js.map