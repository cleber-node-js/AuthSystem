"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
// Middleware para verificar permissões
const checkPermission = (requiredRoles) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(403).json({ message: 'Nenhum token fornecido' });
        }
        const [, token] = authHeader.split(' ');
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const userId = decoded.id;
            const userRole = decoded.role;
            // Buscar usuário no banco para verificar se ele existe e obter seus papéis
            const user = await prisma.user.findUnique({
                where: { id: Number(userId) },
                include: { roles: { include: { role: true } } },
            });
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            // Extrai as roles do usuário
            const userRoles = user.roles.map((userRole) => userRole.role.name);
            // Verifica se o usuário tem pelo menos uma role necessária
            const hasPermission = requiredRoles.some((role) => userRoles.includes(role));
            if (!hasPermission) {
                return res.status(403).json({ message: 'Acesso negado! Permissão insuficiente.' });
            }
            req.userId = userId;
            req.userRole = userRole;
            return next();
        }
        catch (error) {
            return res.status(500).json({ message: 'Falha ao autenticar o token' });
        }
    };
};
exports.checkPermission = checkPermission;
//# sourceMappingURL=permissionMiddleware.js.map