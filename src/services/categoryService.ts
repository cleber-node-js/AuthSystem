import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
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

