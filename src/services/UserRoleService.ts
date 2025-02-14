import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRoleService {
    // Criar uma nova associação UserRole
    async createUserRole(userId: number, roleId: number) {
        try {
            const userRole = await prisma.userRole.create({
                data: {
                    userId,
                    roleId,
                },
            });
            return userRole;
        } catch (error) {
            console.error("Error creating user role:", error);
            throw error; // Re-lançar o erro para ser tratado no controller
        }
    }

    // Buscar todas as associações UserRole
    async getAllUserRoles() {
        try {
            const userRoles = await prisma.userRole.findMany();
            return userRoles;
        } catch (error) {
            console.error("Error fetching user roles:", error);
            throw error;
        }
    }

    // Buscar uma associação UserRole por ID
    async getUserRoleById(id: number) {
        try {
            const userRole = await prisma.userRole.findUnique({
                where: {
                    id: id,
                },
            });
            return userRole;
        } catch (error) {
            console.error("Error fetching user role by ID:", error);
            throw error;
        }
    }

    // Atualizar uma associação UserRole
    async updateUserRole(id: number, userId: number, roleId: number) {
        try {
            const updatedUserRole = await prisma.userRole.update({
                where: {
                    id: id,
                },
                data: {
                    userId,
                    roleId,
                },
            });
            return updatedUserRole;
        } catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    }

    // Deletar uma associação UserRole
    async deleteUserRole(id: number) {
        try {
            const deletedUserRole = await prisma.userRole.delete({
                where: {
                    id: id,
                },
            });
            return deletedUserRole;
        } catch (error) {
            console.error("Error deleting user role:", error);
            throw error;
        }
    }
}