import { Router, Request, Response, NextFunction } from 'express';
import { EventController } from '../controllers/EventController';
import { upload } from '../middlewares/upload';

const router = Router();
const eventController = new EventController();

// Rotas com suporte a upload de imagem
router.post(
  '/',
  upload.single('image'),
  (req: Request, res: Response, next: NextFunction) => {
    eventController.create(req, res).catch(next);
  }
);

router.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    eventController.getAll(req, res).catch(next);
  }
);

router.get(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    eventController.getById(req, res).catch(next);
  }
);

router.put(
  '/:id',
  upload.single('image'), // permite atualizar a imagem também
  (req: Request, res: Response, next: NextFunction) => {
    eventController.update(req, res).catch(next);
  }
);

router.delete(
  '/:id',
  (req: Request, res: Response, next: NextFunction) => {
    eventController.delete(req, res).catch(next);
  }
);

export default router;