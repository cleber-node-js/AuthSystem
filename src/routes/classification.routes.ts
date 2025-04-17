import { Router, Request, Response, NextFunction } from 'express';
import { ClassificationController } from '../controllers/ClassificationController';

const router = Router();
const classificationController = new ClassificationController();

// Rotas ajustadas com funções anônimas e middlewares
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  classificationController.createClassification(req, res).catch(next);
});
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  classificationController.getAllClassifications(req, res).catch(next);
});
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  classificationController.getClassificationById(req, res).catch(next);
});
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  classificationController.updateClassification(req, res).catch(next);
});
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  classificationController.deleteClassification(req, res).catch(next);
});

export default router;
