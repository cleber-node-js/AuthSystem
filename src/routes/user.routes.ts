import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// Ajuste das Rotas com Funções Anônimas
router.post('/users/register', (req: Request, res: Response, next: NextFunction) => {
  userController.register(req, res).catch(next);
});
router.get('/users', (req: Request, res: Response, next: NextFunction) => {
  userController.getAllUsers(req, res).catch(next);
});
router.get('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.getUser(req, res).catch(next);
});
router.put('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.updateUser(req, res).catch(next);
});
router.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => {
  userController.deleteUser(req, res).catch(next);
});

export default router;
