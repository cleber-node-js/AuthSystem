import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { Prisma } from '@prisma/client';

const authService = new AuthService();

export class AuthController {
  register = async (request: Request, response: Response): Promise<Response> => {
    try {
      const { email, password, role } = request.body;

      // Verificações básicas
      if (!email || !password || !role) {
        return response.status(400).json({ message: 'Email, password, and role are required' });
      }

      // Verificar se o papel é válido
      const validRoles = ['ARTIST', 'BUSINESS', 'ADMIN', 'CLIENT'];
      if (!validRoles.includes(role)) {
        return response.status(400).json({ message: 'Role not found' });
      }

      const user = await authService.register(email, password, role);
      console.info(`User registered successfully: ${user.email}`);
      return response.status(201).json({ message: 'User registered successfully', user });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.warn(`Registration error: Email already exists - ${request.body.email}`);
        return response.status(400).json({ message: 'Email already exists' });
      }
      console.error('Registration error:', error);
      return response.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
  };

  login = async (request: Request, response: Response): Promise<Response> => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response.status(400).json({ message: 'Email and password are required' });
      }

      const { token, role } = await authService.login(email, password);
      console.info(`User logged in successfully: ${email}`);
      return response.status(200).json({ token, role });
    } catch (error: unknown) {
      console.error('Login error:', error);
      return response.status(400).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
  };

  getAllUsers = async (request: Request, response: Response): Promise<Response> => {
    try {
      const users = await authService.getAllUsers();
      console.info(`Fetched ${users.length} users`);
      return response.status(200).json(users);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      return response.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
  };
}
