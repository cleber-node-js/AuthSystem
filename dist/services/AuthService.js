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
    async register(email, password, role) {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        if (!role) {
            throw new Error('Role is required');
        }
        const roleEnum = await prisma.role.findUnique({
            where: { name: role.trim().toUpperCase() },
        });
        if (!roleEnum) {
            throw new Error('Role not found');
        }
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Default Name',
                profileType: 'DEFAULT',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                roles: {
                    create: {
                        roleId: roleEnum.id,
                    },
                },
            },
        });
        console.info(`New user created: ${email}, role: ${roleEnum.name}`);
        return user;
    }
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
            throw new Error('Invalid email or password');
        }
        if (!user.roles || user.roles.length === 0) {
            throw new Error('User has no roles assigned.');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.roles[0].role.name }, JWT_SECRET, { expiresIn: '1h' });
        console.info(`Token generated for user: ${email}`);
        return { token, role: user.roles[0].role.name };
    }
    async getAllUsers() {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                profileType: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                password: true, // Incluído para evitar erros de tipagem
                deletedAt: true, // Incluído para evitar erros de tipagem
                phone: true, // Add the 'phone' property
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        console.info(`Retrieved all users: ${users.map(user => user.email).join(', ')}`);
        return users;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map