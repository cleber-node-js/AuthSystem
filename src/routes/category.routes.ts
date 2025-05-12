import express from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = express.Router();
const categoryController = new CategoryController();

router.get('/categories', async (req, res, next) => {
    try {
        await categoryController.getAll(req, res);
    } catch (error) {
        next(error); // Garante que o erro seja passado para o middleware
    }
});



export default router;
