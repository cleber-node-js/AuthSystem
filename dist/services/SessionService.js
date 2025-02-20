"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
class SessionService {
    // Criar uma nova sessão
    async createSession(userId) {
        const sessionToken = crypto_1.default.randomBytes(32).toString('hex'); // Gera um token seguro e aleatório
        // Verificar se o sessionToken já existe
        const existingSession = await prisma.session.findUnique({
            where: { sessionToken },
        });
        if (existingSession) {
            throw new Error('Session token already exists.');
        }
        // Criar uma nova sessão
        return await prisma.session.create({
            data: {
                userId,
                sessionToken,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
    // Obter todas as sessões
    async getAllSessions() {
        return await prisma.session.findMany();
    }
    // Obter uma sessão por ID
    async getSessionById(id) {
        return await prisma.session.findUnique({ where: { id } });
    }
    // Atualizar uma sessão
    async updateSession(id, sessionData) {
        return await prisma.session.update({ where: { id }, data: sessionData });
    }
    // Deletar uma sessão
    async deleteSession(id) {
        return await prisma.session.delete({ where: { id } });
    }
}
exports.SessionService = SessionService;
//# sourceMappingURL=SessionService.js.map