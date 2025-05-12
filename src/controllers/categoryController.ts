import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

const categoryService = new CategoryService();

export class CategoryController {
    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const categories = await categoryService.getAllCategories();
            return res.status(200).json({
                success: true,
                message: 'Categorias buscadas com sucesso.',
                data: categories
            });
        } catch (error: any) {
            console.error('Erro ao buscar categorias:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Erro interno ao buscar categorias.'
            });
        }
    }
}