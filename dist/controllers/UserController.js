"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const userService = new UserService_1.UserService();
class UserController {
    async register(req, res) {
        const { email, password, name, userType, additionalData } = req.body;
        try {
            const user = await userService.registerUser(email, password, name, userType, additionalData);
            res.status(201).json(user);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
            res.status(400).json({ message: errorMessage });
        }
    }
    async getUser(req, res) {
        const userId = Number(req.params.id);
        try {
            const user = await userService.getUserById(userId);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: 'Usuário não encontrado.' });
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro interno no servidor.';
            res.status(500).json({ message: errorMessage });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
            }
            res.status(200).json(users);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro interno no servidor.';
            res.status(500).json({ message: errorMessage });
        }
    }
    async updateUser(req, res) {
        const userId = Number(req.params.id);
        const data = req.body;
        try {
            const updatedUser = await userService.updateUser(userId, data);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário.';
            res.status(400).json({ message: errorMessage });
        }
    }
    async deleteUser(req, res) {
        const userId = Number(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'ID do usuário inválido.' });
        }
        try {
            const deletedUser = await userService.softDeleteUser(userId);
            return res.status(200).json({ message: 'Usuário excluído com sucesso.', user: deletedUser });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao excluir o usuário.' });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map