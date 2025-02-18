import { PrismaClient, UserVerificationToken } from '@prisma/client';

const prisma = new PrismaClient();

export class UserVerificationTokenService {
    async createToken(userId: number, token: string, expiresAt: Date): Promise<UserVerificationToken> {
        return prisma.userVerificationToken.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
    }

    async getTokenByUserId(userId: number): Promise<UserVerificationToken | null> {
        return prisma.userVerificationToken.findUnique({
            where: { userId },
        });
    }

    async getTokenByToken(token: string): Promise<UserVerificationToken | null> {
        return prisma.userVerificationToken.findUnique({
            where: { token },
        });
    }

    async deleteToken(userId: number): Promise<void> {
        await prisma.userVerificationToken.deleteMany({
            where: { userId },
        });
    }

    async isTokenExpired(token: UserVerificationToken | null): Promise<boolean> {
        if (!token) {
            return true;
        }
        return token.expiresAt < new Date();
    }

    async verifyToken(token: string): Promise<boolean> {
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