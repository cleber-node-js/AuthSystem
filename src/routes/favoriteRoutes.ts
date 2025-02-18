import { Router, Request, Response, NextFunction } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';

const router = Router();
const favoriteController = new FavoriteController();

// Ajuste das Rotas com Funções Anônimas
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  favoriteController.addFavorite(req, res).catch(next);
});
router.get('/user/:userId', (req: Request, res: Response, next: NextFunction) => {
  favoriteController.getUserFavorites(req, res).catch(next);
});
router.get('/check', (req: Request, res: Response, next: NextFunction) => {
  favoriteController.checkFavorite(req, res).catch(next);
});
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  favoriteController.getAllFavorites(req, res).catch(next);
});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  favoriteController.removeFavorite(req, res).catch(next);
});

export default router;
