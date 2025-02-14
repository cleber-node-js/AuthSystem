import bcrypt from 'bcrypt';
import { PrismaClient, User, UserProfileType, UserStatus, Establishment } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
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
          profileType = UserProfileType.BUSINESS; // Corrigido para BUSINESS conforme o enum
          break;
        default:
          profileType = UserProfileType.CLIENT;
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
          status: UserStatus.INACTIVE,
          roles: { // Modificação aqui
            create: [ // Use 'create' para criar registros na tabela de junção
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
            } as Establishment,
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
            createdAt: new Date(),
            updatedAt: new Date(),
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

  async softDeleteUser(userId: number): Promise<User> {
    try {
      console.log(`🗑️ Marcando usuário com ID: ${userId} como deletado`);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });

      console.log(`✅ Usuário marcado como deletado: ${updatedUser.name} (ID: ${updatedUser.id})`);
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserById(userId: number): Promise<User | null> {
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      console.log('📃 Buscando todos os usuários...');
      const users = await prisma.user.findMany({ include: { roles: true } });
      return users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUser(userId: number, data: Partial<Omit<User, 'id' | 'password'>>): Promise<User> {
    try {
      console.log(`🔄 Atualizando usuário com ID: ${userId}`);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
      });

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}