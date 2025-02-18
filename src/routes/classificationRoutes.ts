import { Router } from 'express';
import { ClassificationController } from '../controllers/ClassificationController';

const router = Router();
const classificationController = new ClassificationController();

router.post('/', classificationController.createClassification.bind(classificationController));
router.get('/', classificationController.getAllClassifications.bind(classificationController));
router.get('/:id', classificationController.getClassificationById.bind(classificationController));
router.put('/:id', classificationController.updateClassification.bind(classificationController));
router.delete('/:id', classificationController.deleteClassification.bind(classificationController));

export default router;