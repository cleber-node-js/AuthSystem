"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserVerificationTokenService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserVerificationTokenService {
    async createToken(userId, token, expiresAt) {
        return prisma.userVerificationToken.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
    }
    async getTokenByUserId(userId) {
        return prisma.userVerificationToken.findUnique({
            where: { userId },
        });
    }
    async getTokenByToken(token) {
        return prisma.userVerificationToken.findUnique({
            where: { token },
        });
    }
    async deleteToken(userId) {
        await prisma.userVerificationToken.deleteMany({
            where: { userId },
        });
    }
    async isTokenExpired(token) {
        if (!token) {
            return true;
        }
        return token.expiresAt < new Date();
    }
    async verifyToken(token) {
        const verificationToken = await this.getTokenByToken(token);
        if (!verificationToken) {
            return false;
        }
        if (await this.isTokenExpired(verificationToken)) {
            await this.deleteToken(verificationToken.userId);
            return false;
        }
        return true;
    }
}
exports.UserVerificationTokenService = UserVerificationTokenService;
//# sourceMappingURL=userVerificationToken.service.js.map