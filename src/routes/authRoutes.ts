import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRoutes = Router();
const authController = new AuthController();

// Tipagem do controlador
authRoutes.post('/register', async (request: Request, response: Response) => {
  try {
    await authController.register(request, response);
  } catch (err: any) { // Add type annotation for 'err'
    if (!response.headersSent) { // Verifica se a resposta já foi enviada
      response.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
});

authRoutes.post('/login', async (request: Request, response: Response) => {
  try {
    await authController.login(request, response);
  } catch (err: any) { // Add type annotation for 'err'
    if (!response.headersSent) {
      response.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
});

authRoutes.get('/users', authMiddleware, async (request: Request, response: Response) => {
  try {
    await authController.getAllUsers(request, response);
  } catch (err: any) { // Add type annotation for 'err'
    if (!response.headersSent) {
      response.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
});

export { authRoutes };
