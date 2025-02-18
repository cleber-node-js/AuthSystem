import { Router } from 'express';
import { ArtistController } from '../controllers/ArtistController';

const router = Router();
const artistController = new ArtistController();

router.post('/artists', artistController.create.bind(artistController));
router.get('/artists/:id', artistController.getArtist.bind(artistController));
router.get('/artists', artistController.getAll.bind(artistController));
router.put('/artists/:id', artistController.update.bind(artistController));
router.delete('/artists/:id', artistController.delete.bind(artistController));

export default router;
