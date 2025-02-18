import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { Prisma } from '@prisma/client';

const authService = new AuthService();

export class AuthController {
  register = async (request: Request, response: Response): Promise<Response> => {
    try {
      const { email, password, role } = request.body;

      if (!email || !password || !role) {
        return response.status(400).json({ message: 'Email, password, and role are required' });
      }

      const user = await authService.register(email, password, role);
      console.info(`User registered successfully: ${user.email}`);
      return response.status(201).json({ message: 'User registered successfully', user });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.warn(`Registration error: Email already exists - ${request.body.email}`);
          return response.status(400).json({ message: 'Email already exists' });
        }
      } else if (error instanceof Error) {
        console.error('Registration error:', error);
        return response.status(400).json({ message: error.message });
      } else {
        console.error('Registration error:', error);
        return response.status(500).json({ message: 'Internal server error' });
      }
      return response.status(500).json({ message: 'Unknown error' });
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
      if (error instanceof Error && error.message === 'Invalid email or password') {
        console.warn(`Login error: Invalid email or password - ${request.body.email}`);
        return response.status(400).json({ message: 'Invalid email or password' });
      }
      if (error instanceof Error && error.message === 'User has no roles assigned.') {
          console.warn(`Login error: User has no roles - ${request.body.email}`);
          return response.status(400).json({ message: 'User has no roles assigned.' });
      }

      console.error('Login error:', error);
      if (error instanceof Error) {
        return response.status(400).json({ message: error.message });
      } else {
        return response.status(500).json({ message: 'Internal server error' });
      }
      return response.status(500).json({ message: 'Unknown error' });
    }
  };

  getAllUsers = async (request: Request, response: Response): Promise<Response> => {
    try {
      const users = await authService.getAllUsers();
      console.info(`Fetched ${users.length} users`);
      return response.status(200).json(users);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      if (error instanceof Error) {
        return response.status(500).json({ message: 'Internal server error', error: error.message });
      } else {
        return response.status(500).json({ message: 'Unknown error' });
      }
    }
  };
}
