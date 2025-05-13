import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Interface estendida para incluir dados do token no request
 */
export interface CustomRequest extends Request {
  user_id?: string;
  userRole?: string;
  establishmentId?: number;
}

/**
 * 🔐 Middleware de autenticação geral
 */
export const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  console.log('MIddleware Calling')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error("❌ Token ausente ou inválido.");
    res.status(401).json({ message: 'Token de autenticação é necessário.' });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { user_id: number; role: string };

    req.user_id = decoded.user_id.toString();
    req.userRole = decoded.role;

    console.log("✅ Usuário autenticado:", decoded);
    next();
  } catch (error) {
    console.error("❌ Erro ao validar o token:", error);
    res.status(401).json({ message: 'Token inválido ou expirado.' });
    return;
  }
};

/**
 * 🔐 Middleware para autenticação de donos de estabelecimentos
 */
export const authenticateOwner = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  await authMiddleware(req, res, async () => {
    if (req.userRole !== 'BUSINESS') {
      return res.status(403).json({ message: 'Apenas donos de estabelecimentos podem acessar esta rota.' });
    }

    const establishmentId = Number(req.params.id);
    if (isNaN(establishmentId)) {
      return res.status(400).json({ message: 'ID do estabelecimento inválido.' });
    }

    const establishment = await prisma.establishment.findUnique({ where: { id: establishmentId } });
    if (!establishment) {
      return res.status(404).json({ message: 'Estabelecimento não encontrado.' });
    }

    if (establishment.primaryOwner_id !== Number(req.user_id)) {
      return res.status(403).json({ message: 'Você não tem permissão para modificar este estabelecimento.' });
    }

    req.establishmentId = establishmentId;
    next();
  });
};
