import { Request } from 'express';
import { UserProfileType, UserStatus } from '@prisma/client';

/**
 * Interface personalizada para o usuário autenticado no sistema
 */
export interface CustomUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;  
  password: string;
  profileType: UserProfileType;
  status: UserStatus;
  role: string;  // ✅ Adicionado para corresponder ao tipo esperado
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}


/**
 * Interface personalizada para o Request do Express, incluindo o usuário autenticado
 */
export interface CustomRequest extends Request {
  user?: CustomUser; // Usuário opcional, pois pode não estar autenticado
}
