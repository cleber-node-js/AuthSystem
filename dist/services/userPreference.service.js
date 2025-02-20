"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserPreferenceService {
    async getPreferencesByUserId(userId) {
        const userPreference = await prisma.userPreference.findFirst({
            where: { userId }, // Buscar por userId usando findFirst
        });
        return userPreference;
    }
    async createPreferences(userId, interests, favoriteCategories) {
        return prisma.userPreference.create({
            data: {
                userId,
                interests,
                favoriteCategories,
            },
        });
    }
    async updatePreferences(id, data) {
        return prisma.userPreference.update({
            where: { id }, // Usando id para a chave única
            data,
        });
    }
    async deletePreferences(id) {
        await prisma.userPreference.delete({
            where: { id }, // Usando id para a chave única
        });
    }
}
exports.UserPreferenceService = UserPreferenceService;
//# sourceMappingURL=userPreference.service.js.map