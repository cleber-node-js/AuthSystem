"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateOwner = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
/**
 * 🔐 Middleware de autenticação geral
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error("❌ Token ausente ou inválido.");
        res.status(401).json({ message: 'Token de autenticação é necessário.' });
        return;
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId.toString();
        req.userRole = decoded.role;
        console.log("✅ Usuário autenticado:", decoded);
        next();
    }
    catch (error) {
        console.error("❌ Erro ao validar o token:", error);
        res.status(401).json({ message: 'Token inválido ou expirado.' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
/**
 * 🔐 Middleware para autenticação de donos de estabelecimentos
 */
const authenticateOwner = async (req, res, next) => {
    await (0, exports.authMiddleware)(req, res, async () => {
        if (req.userRole !== 'BUSINESS') {
            return res.status(403).json({ message: 'Apenas donos de estabelecimentos podem acessar esta rota.' });
        }
        const establishmentId = Number(req.params.id);
        if (isNaN(establishmentId)) {
            return res.status(400).json({ message: 'ID do estabelecimento inválido.' });
        }
        const establishment = await prisma.establishment.findUnique({ where: { id: establishmentId } });
        if (!establishment) {
            return res.status(404).json({ message: 'Estabelecimento não encontrado.' });
        }
        if (establishment.primaryOwnerId !== Number(req.userId)) {
            return res.status(403).json({ message: 'Você não tem permissão para modificar este estabelecimento.' });
        }
        req.establishmentId = establishmentId;
        next();
    });
};
exports.authenticateOwner = authenticateOwner;
//# sourceMappingURL=authMiddleware.js.map