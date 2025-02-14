import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface CustomRequest extends Request {
  userId?: string;
}

export const checkPermission = (requiredRoles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
      const userId = decoded.id;
      const userRole = decoded.role;

      req.userId = userId;
      return next();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }
  };
};