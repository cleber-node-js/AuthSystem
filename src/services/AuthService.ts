import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User, UserProfileType } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService {
    async register(email: string, password: string, role: string): Promise<User> {
        // Lista de roles válidas
        const validRoles = ['USER', 'ADMIN'];

        // Normaliza e verifica se o role é válido
        const normalizedRole = role.trim().toUpperCase(); 
        if (!validRoles.includes(normalizedRole)) {
            throw new Error('Role not found');
        }

        // Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário com a role
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Default Name',
                profileType: 'DEFAULT' as UserProfileType,
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                roles: {
                    create: {
                        role: {
                            connectOrCreate: {
                                where: { name: normalizedRole },
                                create: { name: normalizedRole },
                            },
                        },
                    },
                },
            },
        });

        console.info(`New user created: ${email}, role: ${normalizedRole}`);
        return user;
    }

    async login(email: string, password: string): Promise<{ token: string; role: string }> {
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

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        if (!user.roles || user.roles.length === 0) {
            throw new Error('User has no roles assigned.');
        }

        const token = jwt.sign(
            { userId: user.id, role: user.roles[0].role.name },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.info(`Token generated for user: ${email}`);
        return { token, role: user.roles[0].role.name };
    }

    async getAllUsers(): Promise<User[]> {
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
