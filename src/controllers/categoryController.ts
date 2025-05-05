import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { CategoryType } from '@prisma/client'; // Importe CategoryType para validação

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

    async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = req.body;

            // ✅ Validação: Verifica se o nome da categoria foi fornecido
            if (!name || typeof name !== 'string' || name.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'O nome da categoria é obrigatório e deve ser uma string não vazia.'
                });
            }

            // ✅ Opcional: Valida se o nome fornecido corresponde a um CategoryType válido
            // Remova esta validação se você quiser permitir nomes de categoria arbitrários
            if (!categoryService.isValidCategoryType(name)) {
                 const validTypes = Object.values(CategoryType).join(', ');
                 return res.status(400).json({
                     success: false,
                     error: `Nome de categoria inválido. Nomes permitidos (baseado em CategoryType): ${validTypes}.`,
                 });
            }

            // Cria a categoria usando o nome validado
            const newCategory = await categoryService.createCategory(name.trim() as CategoryType);

            return res.status(201).json({
                success: true,
                message: 'Categoria criada com sucesso.',
                data: newCategory
            });
        } catch (error: any) {
             // Verifica se o erro é de violação de unique constraint (categoria já existe)
             if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
                return res.status(409).json({ // 409 Conflict
                    success: false,
                    error: `A categoria com o nome '${req.body.name}' já existe.`
                });
             }
            console.error('Erro ao criar categoria:', error.message);
            return res.status(500).json({
                success: false,
                error: 'Erro interno ao criar categoria.'
            });
        }
    }
}