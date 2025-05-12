import { PrismaClient, UserVerificationToken } from '@prisma/client';

const prisma = new PrismaClient();

export class UserVerificationTokenService {
    async createToken(user_id: number, token: string, expiresAt: Date): Promise<UserVerificationToken> {
        return prisma.userVerificationToken.create({
            data: {
                user_id,
                token,
                expiresAt,
            },
        });
    }

    async getTokenByUserId(user_id: number): Promise<UserVerificationToken | null> {
        return prisma.userVerificationToken.findUnique({
            where: { user_id },
        });
    }

    async getTokenByToken(token: string): Promise<UserVerificationToken | null> {
        return prisma.userVerificationToken.findUnique({
            where: { token },
        });
    }

    async deleteToken(user_id: number): Promise<void> {
        await prisma.userVerificationToken.deleteMany({
            where: { user_id },
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
            await this.deleteToken(verificationToken.user_id);
            return false;
        }
        return true;
    }
}