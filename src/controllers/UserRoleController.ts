import { Request, Response } from 'express';
import { UserRoleService } from '../services/UserRoleService';

const userRoleService = new UserRoleService();

export class UserRoleController {
    // Criar uma nova associação UserRole
    async createUserRole(req: Request, res: Response) {
        console.log(`📩 Requisição recebida: POST /user-roles`, req.body);
        const { userId, roleId } = req.body;

        try {
            const userRole = await userRoleService.createUserRole(userId, roleId);
            console.log(`✅ Associação criada:`, userRole);
            return res.status(201).json(userRole);
        } catch (error) {
            console.error("❌ Erro ao criar associação UserRole:", error);
            return res.status(500).json({ error: "Falha ao criar associação UserRole" });
        }
    }

    // Buscar todas as associações UserRole
    async getAllUserRoles(req: Request, res: Response) {
        console.log(`📩 Requisição recebida: GET /user-roles`);
        try {
            const userRoles = await userRoleService.getAllUserRoles();
            console.log(`📋 Lista de associações:`, userRoles);
            return res.status(200).json(userRoles);
        } catch (error) {
            console.error("❌ Erro ao buscar associações UserRole:", error);
            return res.status(500).json({ error: "Falha ao buscar associações UserRole" });
        }
    }

    // Buscar uma associação UserRole por ID
    async getUserRoleById(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        console.log(`📩 Requisição recebida: GET /user-roles/${id}`);

        try {
            const userRole = await userRoleService.getUserRoleById(id);
            if (!userRole) {
                console.log(`⚠️ Associação UserRole não encontrada para ID ${id}`);
                return res.status(404).json({ error: "Associação UserRole não encontrada" });
            }
            console.log(`🔍 Associação encontrada:`, userRole);
            return res.status(200).json(userRole);
        } catch (error) {
            console.error("❌ Erro ao buscar associação UserRole por ID:", error);
            return res.status(500).json({ error: "Falha ao buscar associação UserRole" });
        }
    }

    // Atualizar uma associação UserRole
    async updateUserRole(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        console.log(`📩 Requisição recebida: PUT /user-roles/${id}`, req.body);
        const { userId, roleId } = req.body;

        try {
            const updatedUserRole = await userRoleService.updateUserRole(id, userId, roleId);
            console.log(`🔄 Associação atualizada:`, updatedUserRole);
            return res.status(200).json(updatedUserRole);
        } catch (error) {
            console.error("❌ Erro ao atualizar associação UserRole:", error);
            return res.status(500).json({ error: "Falha ao atualizar associação UserRole" });
        }
    }

    // Deletar uma associação UserRole
    async deleteUserRole(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        console.log(`📩 Requisição recebida: DELETE /user-roles/${id}`);

        try {
            await userRoleService.deleteUserRole(id);
            console.log(`🗑️ Associação UserRole deletada: ID ${id}`);
            return res.status(200).json({ message: "Associação UserRole deletada com sucesso" });
        } catch (error) {
            console.error("❌ Erro ao deletar associação UserRole:", error);
            return res.status(500).json({ error: "Falha ao deletar associação UserRole" });
        }
    }
}
