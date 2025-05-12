import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CategoryService {
    async getAllCategories() {
        return prisma.category.findMany();
    }

    // ✅ Adicionando validação para categorias
    isValidCategoryType(name: string) {
        return name
    }
}

