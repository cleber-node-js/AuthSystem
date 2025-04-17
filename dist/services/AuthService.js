"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
class AuthService {
    /**
     * 🔹 Gera um token de aprovação para um artista.
     */
    static generateArtistApprovalToken(artistId, establishmentId) {
        if (!artistId || !establishmentId) {
            throw new Error('IDs inválidos para gerar o token.');
        }
        return jsonwebtoken_1.default.sign({ artistId, establishmentId }, JWT_SECRET, { expiresIn: '7d' } // Expira em 7 dias
        );
    }
    /**
     * 🔹 Verifica e decodifica um token JWT.
     */
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return typeof decoded === 'object' && decoded !== null ? decoded : null;
        }
        catch (error) {
            console.error("❌ Erro ao verificar token:", error);
            return null;
        }
    }
    /**
     * 🔹 Registro de usuários com associação ao papel correto.
     */
    async register(email, password, role) {
        const validRoles = ["ARTIST", "BUSINESS", "USER", "ADMIN", "CLIENT"]; // ✅ Adicionado "CLIENT"
        if (!validRoles.includes(role)) {
            throw new Error("Role not found");
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email já cadastrado.");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        let profileType;
        switch (role) {
            case "CLIENT":
                profileType = client_1.UserProfileType.CLIENT;
                break;
            case "ARTIST":
                profileType = client_1.UserProfileType.ARTIST;
                break;
            case "BUSINESS":
                profileType = client_1.UserProfileType.BUSINESS;
                break;
            default:
                profileType = client_1.UserProfileType.USER; // Caso não seja um dos anteriores, define como USER
        }
        let userRole = await prisma.role.findUnique({ where: { name: role } });
        if (!userRole) {
            userRole = await prisma.role.create({ data: { name: role } });
        }
        return prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: email.split('@')[0], // Usa parte do email como nome padrão se não for fornecido
                profileType,
                status: client_1.UserStatus.INACTIVE,
                roles: {
                    create: [{ role: { connect: { id: userRole.id } } }],
                },
            },
        });
    }
    /**
     * 🔹 Login de usuário e geração de token JWT.
     */
    async login(email, password) {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            throw new Error("Invalid email or password");
        }
        if (!user.roles || user.roles.length === 0) {
            throw new Error("User has no roles assigned.");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.roles[0].role.name }, JWT_SECRET, { expiresIn: "1h" });
        return { token, role: user.roles[0].role.name };
    }
    /**
     * 🔹 Retorna todos os usuários cadastrados.
     */
    async getAllUsers() {
        return prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                password: true, // Include the password field
                profileType: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                phone: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map