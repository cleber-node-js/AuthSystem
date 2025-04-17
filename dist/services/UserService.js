"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserService {
    /**
     * 🔹 Retorna todos os usuários
     */
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany();
            return users;
        }
        catch (error) {
            console.error("❌ Erro ao buscar usuários:", error);
            throw new Error("Erro ao buscar usuários no banco de dados.");
        }
    }
    /**
     * 🔹 Buscar usuário por ID
     */
    async getUserById(userId) {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            return user;
        }
        catch (error) {
            console.error(`❌ Erro ao buscar usuário ID ${userId}:`, error);
            throw new Error("Erro ao buscar usuário.");
        }
    }
    /**
     * 🔹 Atualizar usuário
     */
    async updateUser(userId, data) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data,
            });
            return updatedUser;
        }
        catch (error) {
            console.error(`❌ Erro ao atualizar usuário ID ${userId}:`, error);
            throw new Error("Erro ao atualizar usuário.");
        }
    }
    /**
     * 🔹 Soft delete (marca o usuário como excluído, sem remover do banco)
     */
    async softDeleteUser(userId) {
        try {
            const deletedUser = await prisma.user.update({
                where: { id: userId },
                data: { deletedAt: new Date() },
            });
            return deletedUser;
        }
        catch (error) {
            console.error(`❌ Erro ao excluir usuário ID ${userId}:`, error);
            throw new Error("Erro ao excluir usuário.");
        }
    }
    /**
     * 🔹 Registrar um novo usuário
     */
    async registerUser(email, password, name, userType, additionalData) {
        try {
            console.log(`🔄 Registrando usuário: ${email}, Tipo: ${userType}`);
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                console.error(`❌ Erro: Email já cadastrado (${email})`);
                throw new Error('Email já cadastrado.');
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            let profileType;
            switch (userType) {
                case 'ARTIST':
                    profileType = client_1.UserProfileType.ARTIST;
                    break;
                case 'ESTABLISHMENT':
                    profileType = client_1.UserProfileType.BUSINESS;
                    break;
                default:
                    profileType = client_1.UserProfileType.CLIENT;
            }
            let userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
            if (!userRole) {
                userRole = await prisma.role.create({ data: { name: 'USER' } });
            }
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    profileType,
                    status: client_1.UserStatus.INACTIVE,
                    roles: {
                        create: [{ role: { connect: { id: userRole.id } } }],
                    },
                },
            });
            console.log(`✅ Usuário criado com ID: ${user.id}`);
            if (userType === 'ARTIST') {
                if (!additionalData || !additionalData.establishmentId) {
                    throw new Error('Dados adicionais para artista são obrigatórios.');
                }
                let establishment = await prisma.establishment.findUnique({
                    where: { id: additionalData.establishmentId },
                });
                if (!establishment) {
                    if (!additionalData.establishmentName) {
                        throw new Error('Nome do estabelecimento é obrigatório.');
                    }
                    establishment = await prisma.establishment.create({
                        data: {
                            name: additionalData.establishmentName,
                            address: additionalData.address,
                            contact: additionalData.contact,
                            primaryOwnerId: user.id,
                        },
                    });
                    console.log(`🏢 Novo estabelecimento criado: ${establishment.name}`);
                }
                await prisma.artist.create({
                    data: {
                        name: additionalData.name,
                        genre: additionalData.genre,
                        bio: additionalData.bio,
                        status: 'PENDING',
                        establishments: {
                            create: {
                                establishment: { connect: { id: establishment.id } }, // ✅ Correção aqui
                                status: 'PENDING'
                            },
                        },
                    },
                });
                console.log(`🎨 Artista ${additionalData.name} registrado no estabelecimento ${establishment.name}`);
            }
            else if (userType === 'ESTABLISHMENT') {
                if (!additionalData) {
                    throw new Error('Dados adicionais para estabelecimento são obrigatórios.');
                }
                await prisma.establishment.create({
                    data: {
                        name: additionalData.name,
                        address: additionalData.address,
                        contact: additionalData.contact,
                        primaryOwnerId: user.id,
                    },
                });
                console.log(`🏢 Estabelecimento ${additionalData.name} registrado com sucesso!`);
            }
            return user;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map