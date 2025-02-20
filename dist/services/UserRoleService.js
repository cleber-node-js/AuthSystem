"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserRoleService {
    async createUserRole(userId, roleId) {
        try {
            const existingUserRole = await prisma.userRole.findUnique({
                where: {
                    userId_roleId: {
                        userId,
                        roleId,
                    },
                },
            });
            if (existingUserRole) {
                console.warn('UserRole association already exists.');
                return null;
            }
            return await prisma.userRole.create({
                data: {
                    userId,
                    roleId,
                },
            });
        }
        catch (error) {
            console.error("Error creating user role:", error);
            throw error;
        }
    }
    async getAllUserRoles() {
        try {
            const userRoles = await prisma.userRole.findMany();
            return userRoles;
        }
        catch (error) {
            console.error("Error fetching user roles:", error);
            throw error;
        }
    }
    async getUserRoleById(userId, roleId) {
        try {
            const userRole = await prisma.userRole.findUnique({
                where: {
                    userId_roleId: {
                        userId,
                        roleId,
                    },
                },
            });
            return userRole;
        }
        catch (error) {
            console.error("Error fetching user role by ID:", error);
            throw error;
        }
    }
    async updateUserRole(userId, roleId, newUserId, newRoleId) {
        try {
            const updatedUserRole = await prisma.userRole.update({
                where: {
                    userId_roleId: {
                        userId,
                        roleId,
                    },
                },
                data: {
                    userId: newUserId,
                    roleId: newRoleId,
                },
            });
            return updatedUserRole;
        }
        catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    }
    async deleteUserRole(userId, roleId) {
        try {
            const deletedUserRole = await prisma.userRole.delete({
                where: {
                    userId_roleId: {
                        userId,
                        roleId,
                    },
                },
            });
            return deletedUserRole;
        }
        catch (error) {
            console.error("Error deleting user role:", error);
            throw error;
        }
    }
}
exports.UserRoleService = UserRoleService;
//# sourceMappingURL=UserRoleService.js.map