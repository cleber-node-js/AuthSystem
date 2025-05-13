import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface CustomRequest extends Request {
  user_id?: string;
  userRole?: string;
}

// Middleware para verificar permissões
export const checkPermission = (requiredRoles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: 'Nenhum token fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
      const user_id = decoded.id;
      const userRole = decoded.role;

      // Buscar usuário no banco para verificar se ele existe e obter seus papéis
      const user = await prisma.user.findUnique({
        where: { id: Number(user_id) },
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

      req.user_id = user_id;
      req.userRole = userRole;
      return next();
    } catch (error) {
      return res.status(500).json({ message: 'Falha ao autenticar o token' });
    }
  };
};
