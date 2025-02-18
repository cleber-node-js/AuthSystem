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
                    profileType = client_1.UserProfileType.BUSINESS; // Corrigido para BUSINESS conforme o enum
                    break;
                default:
                    profileType = client_1.UserProfileType.CLIENT;
            }
            // Verifica se a role 'USER' existe; caso contrário, cria uma nova
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
                        create: [
                            {
                                role: {
                                    connect: { id: userRole.id }, // Conecta à Role existente com o ID da role 'USER'
                                },
                            },
                        ],
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
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    });
                    console.log(`🏢 Novo estabelecimento criado: ${establishment.name}`);
                }
                await prisma.artist.create({
                    data: {
                        name: additionalData.name,
                        genre: additionalData.genre,
                        bio: additionalData.bio,
                        establishmentId: establishment.id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
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
                        createdAt: new Date(),
                        updatedAt: new Date(),
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
    async softDeleteUser(userId) {
        try {
            console.log(`🗑️ Marcando usuário com ID: ${userId} como deletado`);
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { deletedAt: new Date() },
            });
            console.log(`✅ Usuário marcado como deletado: ${updatedUser.name} (ID: ${updatedUser.id})`);
            return updatedUser;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getUserById(userId) {
        try {
            console.log(`🔍 Buscando usuário com ID: ${userId}`);
            if (isNaN(userId)) {
                throw new Error('ID do usuário inválido.');
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { roles: true },
            });
            return user;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            console.log('📃 Buscando todos os usuários...');
            const users = await prisma.user.findMany({ include: { roles: true } });
            return users;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async updateUser(userId, data) {
        try {
            console.log(`🔄 Atualizando usuário com ID: ${userId}`);
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data,
            });
            return updatedUser;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map