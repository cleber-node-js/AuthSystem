import { Router, Request, Response } from 'express';
import { ArtistController } from '../controllers/ArtistController';

const router = Router();
const artistController = new ArtistController();

// Ajuste das Rotas com Funções Anônimas
router.post('/artists', (req: Request, res: Response) => {
  artistController.create(req, res);
});
router.get('/artists/:id', (req: Request, res: Response) => {
  artistController.getArtist(req, res);
});
router.get('/artists', (req: Request, res: Response) => {
  artistController.getAll(req, res);
});
router.put('/artists/:id', (req: Request, res: Response) => {
  artistController.update(req, res);
});
router.delete('/artists/:id', (req: Request, res: Response) => {
  artistController.delete(req, res);
});

export default router;
