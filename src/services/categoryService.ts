import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
    readonly categories = [
        { type: 'Agenda', name: 'Agenda', imageUrl: '' },
        { type: 'MUSIC', name: 'Musical', imageUrl: '' },
        { type: 'GASTRONIMIC', name: 'Gastronomia', imageUrl: '' },
        { type: 'CINEMA', name: 'Cinema', imageUrl: '' },
        { type: 'ART', name: 'Artistas', imageUrl: '' },
        { type: 'ESPORT', name: 'Esportes', imageUrl: '' },
        { type: 'OTHER', name: 'Outros', imageUrl: '' }
    ];

    async getAllCategories() {
        return prisma.category.findMany();
    }

    // ✅ Adicionando validação para categorias
    isValidCategoryType(name: string): boolean {
        return Object.values(CategoryType).includes(name as CategoryType);
    }

    async createCategory(name: string) {
        if (!this.isValidCategoryType(name)) {
            throw new Error("Categoria inválida");
        }

        return prisma.category.create({
            data: { name }
        });
    }
}

