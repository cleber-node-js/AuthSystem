import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Interface para adicionar informações do usuário ao Request
export interface CustomRequest extends Request {
  user_id?: string;
  userRole?: string;
}

// Middleware para verificar permissões de acesso
export const checkPermission = (requiredRoles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: 'Nenhum token fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
      // 🔍 Decodifica o token JWT
      const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number; role: string };
      req.user_id = decoded.user_id.toString();
      req.userRole = decoded.role;

      // 🔍 Busca o usuário no banco de dados
      const user = await prisma.user.findUnique({
        where: { id: Number(req.user_id) },
        include: { roles: { include: { role: true } } },
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // 🔍 Verifica as roles do usuário
    const userRoles: string[] = user.roles.map((userRole) => userRole.role.name);
      const hasPermission = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasPermission) {
        return res.status(403).json({ message: 'Acesso negado! Permissão insuficiente.' });
      }

      console.log(`✅ Acesso autorizado para usuário ${req.user_id} (${req.userRole})`);
      return next();
    } catch (error) {
      console.error(`❌ Erro na validação do token:`, error);
      return res.status(500).json({ message: 'Falha ao autenticar o token' });
    }
  };
};
