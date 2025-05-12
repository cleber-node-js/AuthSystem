import { Request, Response } from 'express';
import { UserRoleService } from '../services/UserRoleService';

const userRoleService = new UserRoleService();

export class UserRoleController {
    async createUserRole(req: Request, res: Response): Promise<void> {
        console.log(`📩 Requisição recebida: POST /user-roles`, req.body);
        const { user_id, role_id } = req.body;

        if (typeof user_id !== 'number' || typeof role_id !== 'number' || isNaN(user_id) || isNaN(role_id)) {
            res.status(400).json({ error: "Invalid user_id or role_id. They must be numbers." });
            return;
        }

        try {
            const userRole = await userRoleService.createUserRole(user_id, role_id);
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
        const user_id = parseInt(req.params.id, 10);
        const role_id = parseInt(req.query.role_id as string, 10);
        console.log(`📩 Requisição recebida: GET /user-roles/${user_id}?role_id=${role_id}`);

        if (isNaN(user_id) || isNaN(role_id)) {
            res.status(400).json({ error: "Invalid user_id or role_id" });
            return;
        }
        try {
            const userRole = await userRoleService.getUserRoleById(user_id, role_id);
            if (!userRole) {
                console.log(`⚠️ Associação UserRole não encontrada para ID ${user_id} e role_id ${role_id}`);
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
        const user_id = parseInt(req.params.id, 10);
        const { role_id, newuser_id, newRole_id } = req.body;

        if (isNaN(user_id) || typeof role_id !== 'number' || typeof newuser_id !== 'number' || typeof newRole_id !== 'number' || isNaN(newuser_id) || isNaN(newRole_id)) {
            res.status(400).json({ error: "Invalid user_id, role_id or newuser_id or newRole_id.  They must be numbers." });
            return;
        }

        console.log(`📩 Requisição recebida: PUT /user-roles/${user_id}`, req.body);

        try {
            const updatedUserRole = await userRoleService.updateUserRole(user_id, role_id, newuser_id, newRole_id);
            console.log(`🔄 Associação atualizada:`, updatedUserRole);
            res.status(200).json(updatedUserRole);
        } catch (error) {
            console.error("❌ Erro ao atualizar associação UserRole:", error);
            res.status(500).json({ error: "Falha ao atualizar associação UserRole" });
        }
    }

    async deleteUserRole(req: Request, res: Response): Promise<void> {
        const user_id = parseInt(req.params.id, 10);
        const role_id = parseInt(req.query.role_id as string, 10);

        if (isNaN(user_id) || isNaN(role_id)) {
            res.status(400).json({ error: "Invalid user_id or roleId" });
            return;
        }

        console.log(`📩 Requisição recebida: DELETE /user-roles/${user_id}?roleId=${role_id}`);

        try {
            await userRoleService.deleteUserRole(user_id, role_id);
            console.log(`🗑️ Associação UserRole deletada: ID ${user_id}, Role ID ${role_id}`);
            res.status(200).json({ message: "Associação UserRole deletada com sucesso" });
        } catch (error) {
            console.error("❌ Erro ao deletar associação UserRole:", error);
            res.status(500).json({ error: "Falha ao deletar associação UserRole" });
        }
    }
}