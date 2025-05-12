import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRoleService {
    async createUserRole(user_id: number, role_id: number): Promise<UserRole | null> {
        try {
            const existingUserRole = await prisma.userRole.findUnique({
                where: {
                    user_id_role_id: {
                        user_id,
                        role_id,
                    },
                },
            });

            if (existingUserRole) {
                console.warn('UserRole association already exists.');
                return null;
            }

            return await prisma.userRole.create({
                data: {
                    user_id,
                    role_id,
                },
            });
        } catch (error) {
            console.error("Error creating user role:", error);
            throw error;
        }
    }

    async getAllUserRoles(): Promise<UserRole[]> {
        try {
            const userRoles = await prisma.userRole.findMany();
            return userRoles;
        } catch (error) {
            console.error("Error fetching user roles:", error);
            throw error;
        }
    }

    async getUserRoleById(user_id: number, role_id: number): Promise<UserRole | null> {
        try {
            const userRole = await prisma.userRole.findUnique({
                where: {
                    user_id_role_id: {
                        user_id,
                        role_id,
                    },
                },
            });
            return userRole;
        } catch (error) {
            console.error("Error fetching user role by ID:", error);
            throw error;
        }
    }

    async updateUserRole(user_id: number, role_id: number, newUser_id: number, newRole_id: number): Promise<UserRole> {
        try {
            const updatedUserRole = await prisma.userRole.update({
                where: {
                    user_id_role_id: {
                        user_id,
                        role_id,
                    },
                },
                data: {
                    user_id: newUser_id,
                    role_id: newRole_id,
                },
            });
            return updatedUserRole;
        } catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    }

    async deleteUserRole(user_id: number, role_id: number): Promise<UserRole> {
        try {
            const deletedUserRole = await prisma.userRole.delete({
                where: {
                    user_id_role_id: {
                        user_id,
                        role_id,
                    },
                },
            });
            return deletedUserRole;
        } catch (error) {
            console.error("Error deleting user role:", error);
            throw error;
        }
    }
}