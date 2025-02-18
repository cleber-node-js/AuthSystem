import { Request, Response } from 'express';
import { UserRoleService } from '../services/UserRoleService';

const userRoleService = new UserRoleService();

export class UserRoleController {
    async createUserRole(req: Request, res: Response): Promise<void> {
        console.log(`📩 Requisição recebida: POST /user-roles`, req.body);
        const { userId, roleId } = req.body;

        if (typeof userId !== 'number' || typeof roleId !== 'number' || isNaN(userId) || isNaN(roleId)) {
            res.status(400).json({ error: "Invalid userId or roleId. They must be numbers." });
            return;
        }

        try {
            const userRole = await userRoleService.createUserRole(userId, roleId);
            if (!userRole) {
                console.log("❌ Associação UserRole já existe.");
                res.status(409).json({ error: "Associação UserRole já existe" });
                return;
            }
            console.log(`✅ Associação criada:`, userRole);
            res.status(201).json(userRole);
        } catch (error) {
            console.error("❌ Erro ao criar associação UserRole:", error);
            res.status(500).json({ error: "Falha ao criar associação UserRole" });
        }
    }

    async getAllUserRoles(req: Request, res: Response): Promise<void> {
        console.log(`📩 Requisição recebida: GET /user-roles`);
        try {
            const userRoles = await userRoleService.getAllUserRoles();
            console.log(`📋 Lista de associações:`, userRoles);
            res.status(200).json(userRoles);
        } catch (error) {
            console.error("❌ Erro ao buscar associações UserRole:", error);
            res.status(500).json({ error: "Falha ao buscar associações UserRole" });
        }
    }

    async getUserRoleById(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);
        const roleId = parseInt(req.query.roleId as string, 10);
        console.log(`📩 Requisição recebida: GET /user-roles/${userId}?roleId=${roleId}`);

        if (isNaN(userId) || isNaN(roleId)) {
            res.status(400).json({ error: "Invalid userId or roleId" });
            return;
        }
        try {
            const userRole = await userRoleService.getUserRoleById(userId, roleId);
            if (!userRole) {
                console.log(`⚠️ Associação UserRole não encontrada para ID ${userId} e roleId ${roleId}`);
                res.status(404).json({ error: "Associação UserRole não encontrada" });
                return;
            }
            console.log(`🔍 Associação encontrada:`, userRole);
            res.status(200).json(userRole);
        } catch (error) {
            console.error("❌ Erro ao buscar associação UserRole por ID:", error);
            res.status(500).json({ error: "Falha ao buscar associação UserRole" });
        }
    }

    async updateUserRole(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);
        const { roleId, newUserId, newRoleId } = req.body;

        if (isNaN(userId) || typeof roleId !== 'number' || typeof newUserId !== 'number' || typeof newRoleId !== 'number' || isNaN(newUserId) || isNaN(newRoleId)) {
            res.status(400).json({ error: "Invalid userId, roleId or newUserId or newRoleId.  They must be numbers." });
            return;
        }

        console.log(`📩 Requisição recebida: PUT /user-roles/${userId}`, req.body);

        try {
            const updatedUserRole = await userRoleService.updateUserRole(userId, roleId, newUserId, newRoleId);
            console.log(`🔄 Associação atualizada:`, updatedUserRole);
            res.status(200).json(updatedUserRole);
        } catch (error) {
            console.error("❌ Erro ao atualizar associação UserRole:", error);
            res.status(500).json({ error: "Falha ao atualizar associação UserRole" });
        }
    }

    async deleteUserRole(req: Request, res: Response): Promise<void> {
        const userId = parseInt(req.params.id, 10);
        const roleId = parseInt(req.query.roleId as string, 10);

        if (isNaN(userId) || isNaN(roleId)) {
            res.status(400).json({ error: "Invalid userId or roleId" });
            return;
        }

        console.log(`📩 Requisição recebida: DELETE /user-roles/${userId}?roleId=${roleId}`);

        try {
            await userRoleService.deleteUserRole(userId, roleId);
            console.log(`🗑️ Associação UserRole deletada: ID ${userId}, Role ID ${roleId}`);
            res.status(200).json({ message: "Associação UserRole deletada com sucesso" });
        } catch (error) {
            console.error("❌ Erro ao deletar associação UserRole:", error);
            res.status(500).json({ error: "Falha ao deletar associação UserRole" });
        }
    }
}