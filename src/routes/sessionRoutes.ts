import { Router, Request, Response, NextFunction } from 'express';
import { SessionController } from '../controllers/SessionController';

const router = Router();
const sessionController = new SessionController();

// Ajuste das Rotas com Funções Anônimas
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  sessionController.createSession(req, res).catch(next);
});
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  sessionController.getAllSessions(req, res).catch(next);
});
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  sessionController.getSessionById(req, res).catch(next);
});
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  sessionController.updateSession(req, res).catch(next);
});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  sessionController.deleteSession(req, res).catch(next);
});

export default router;
