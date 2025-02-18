import { Router, Request, Response, NextFunction } from 'express';
import { EstablishmentController } from '../controllers/EstablishmentController';

const establishmentController = new EstablishmentController();
const router = Router();

// Ajuste das Rotas com Funções Anônimas
router.post('/establishments', (req: Request, res: Response, next: NextFunction) => {
  establishmentController.create(req, res).catch(next);
});
router.get('/establishments/:id', (req: Request, res: Response, next: NextFunction) => {
  establishmentController.getById(req, res).catch(next);
});
router.get('/establishments', (req: Request, res: Response, next: NextFunction) => {
  establishmentController.getAll(req, res).catch(next);
});
router.put('/establishments/:id', (req: Request, res: Response, next: NextFunction) => {
  establishmentController.update(req, res).catch(next);
});
router.delete('/establishments/:id', (req: Request, res: Response, next: NextFunction) => {
  establishmentController.delete(req, res).catch(next);
});

export default router;
