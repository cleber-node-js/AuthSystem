import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User, UserProfileType, UserStatus, UserRoleEnum } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService {
  static verifyArtistApprovalToken: any;
  static generateRequestToken: any;
  /**
   * 🔹 Gera um token de aprovação para um artista.
   */
  static generateArtistApprovalToken(artistId: number, establishmentId: number): string {
    if (!artistId || !establishmentId) {
      throw new Error('IDs inválidos para gerar o token.');
    }

    return jwt.sign(
      { artistId, establishmentId },
      JWT_SECRET,
      { expiresIn: '7d' } // Expira em 7 dias
    );
  }

  /**
   * 🔹 Verifica e decodifica um token JWT.
   */
  static verifyToken(token: string): object | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return typeof decoded === 'object' && decoded !== null ? decoded : null;
    } catch (error) {
      console.error("❌ Erro ao verificar token:", error);
      return null;
    }
  }

  /**
   * 🔹 Registro de usuários com associação ao papel correto.
   */
  async register(email: string, password: string, role: UserRoleEnum): Promise<User> {
    const validRoles: UserRoleEnum[] = ["ARTIST", "BUSINESS", "USER", "ADMIN", "CLIENT"]; // ✅ Adicionado "CLIENT"

    if (!validRoles.includes(role)) {
      throw new Error("Role not found");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileType: UserProfileType;

    switch (role) {
    case "CLIENT":
    profileType = UserProfileType.CLIENT;
    break;
    case "ARTIST":
    profileType = UserProfileType.ARTIST;
    break;
    case "BUSINESS":
    profileType = UserProfileType.BUSINESS;
    break;
    default:
    profileType = UserProfileType.USER; // Caso não seja um dos anteriores, define como USER
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
        status: UserStatus.INACTIVE,
        roles: {
          create: [{ role: { connect: { id: userRole.id } } }],
        },
      },
    });
  }

  /**
   * 🔹 Login de usuário e geração de token JWT.
   */
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
      throw new Error("Invalid email or password");
    }

    if (!user.roles || user.roles.length === 0) {
      throw new Error("User has no roles assigned.");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.roles[0].role.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return { token, role: user.roles[0].role.name };
  }

  /**
   * 🔹 Retorna todos os usuários cadastrados.
   */
  async getAllUsers(): Promise<User[]> {
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
