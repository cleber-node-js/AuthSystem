import { Router, Request, Response, NextFunction } from 'express';
import { RatingController } from '../controllers/RatingController';

const router = Router();
const ratingController = new RatingController();

// Ajuste das Rotas com Funções Anônimas
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  ratingController.createRating(req, res).catch(next);
});
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  ratingController.getAllRatings(req, res).catch(next);
});
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  ratingController.getRatingById(req, res).catch(next);
});
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  ratingController.updateRating(req, res).catch(next);
});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  ratingController.deleteRating(req, res).catch(next);
});

export default router;
