import { Router } from 'express';
import { RatingController } from '../controllers/RatingController';

const router = Router();
const ratingController = new RatingController();

router.post('/', ratingController.createRating.bind(ratingController));
router.get('/', ratingController.getAllRatings.bind(ratingController));
router.get('/:id', ratingController.getRatingById.bind(ratingController));
router.put('/:id', ratingController.updateRating.bind(ratingController));
router.delete('/:id', ratingController.deleteRating.bind(ratingController));

export default router;