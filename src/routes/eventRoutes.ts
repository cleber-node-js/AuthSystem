import { Router, Request, Response, NextFunction } from 'express';
import { EventController } from '../controllers/EventController';

const router = Router();
const eventController = new EventController();

// Ajuste das Rotas com Funções Anônimas
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  eventController.create(req, res).catch(next);
});
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  eventController.getAll(req, res).catch(next);
});
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  eventController.getById(req, res).catch(next);
});
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  eventController.update(req, res).catch(next);
});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  eventController.delete(req, res).catch(next);
});

export default router;
