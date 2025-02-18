import { Router } from 'express';
import { FavoriteController } from '../controllers/FavoriteController';

const router = Router();
const favoriteController = new FavoriteController();

router.post('/', favoriteController.addFavorite.bind(favoriteController));
router.get('/user/:userId', favoriteController.getUserFavorites.bind(favoriteController));
router.get('/check', favoriteController.checkFavorite.bind(favoriteController));
router.get('/', favoriteController.getAllFavorites.bind(favoriteController));
router.delete('/:id', favoriteController.removeFavorite.bind(favoriteController));

export default router;
