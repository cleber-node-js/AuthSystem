import bcrypt from 'bcrypt';
import { PrismaClient, User, UserProfileType, UserStatus, Establishment } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  [x: string]: any;
  /**
   * 🔹 Retorna todos os usuários
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("❌ Erro ao buscar usuários:", error);
      throw new Error("Erro ao buscar usuários no banco de dados.");
    }
  }

  /**
   * 🔹 Buscar usuário por ID
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user;
    } catch (error) {
      console.error(`❌ Erro ao buscar usuário ID ${userId}:`, error);
      throw new Error("Erro ao buscar usuário.");
    }
  }

  /**
   * 🔹 Atualizar usuário
   */
  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
      });
      return updatedUser;
    } catch (error) {
      console.error(`❌ Erro ao atualizar usuário ID ${userId}:`, error);
      throw new Error("Erro ao atualizar usuário.");
    }
  }

  /**
   * 🔹 Soft delete (marca o usuário como excluído, sem remover do banco)
   */
  async softDeleteUser(userId: number): Promise<User> {
    try {
      const deletedUser = await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
      return deletedUser;
    } catch (error) {
      console.error(`❌ Erro ao excluir usuário ID ${userId}:`, error);
      throw new Error("Erro ao excluir usuário.");
    }
  }

  /**
   * 🔹 Registrar um novo usuário
   */
  async registerUser(
    email: string,
    password: string,
    name: string,
    userType: 'CLIENT' | 'ARTIST' | 'ESTABLISHMENT',
    additionalData?: any
  ): Promise<User> {
    try {
      console.log(`🔄 Registrando usuário: ${email}, Tipo: ${userType}`);

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        console.error(`❌ Erro: Email já cadastrado (${email})`);
        throw new Error('Email já cadastrado.');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let profileType: UserProfileType;

      switch (userType) {
        case 'ARTIST':
          profileType = UserProfileType.ARTIST;
          break;
        case 'ESTABLISHMENT':
          profileType = UserProfileType.BUSINESS;
          break;
        default:
          profileType = UserProfileType.CLIENT;
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
          status: UserStatus.INACTIVE,
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
      } else if (userType === 'ESTABLISHMENT') {
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
