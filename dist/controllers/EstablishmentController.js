"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablishmentController = void 0;
const EstablishmentService_1 = require("../services/EstablishmentService");
const establishmentService = new EstablishmentService_1.EstablishmentService();
class EstablishmentController {
    // Método para criar um novo estabelecimento
    async create(req, res) {
        try {
            const { name, address, contact, primaryOwnerId } = req.body; // Incluído address e contact
            const establishment = await establishmentService.createEstablishment(name, address, contact, primaryOwnerId);
            return res.status(201).json(establishment);
        }
        catch (error) {
            console.error(`❌ Erro ao criar estabelecimento:`, error);
            return res.status(500).json({ error: 'Erro ao criar estabelecimento.' });
        }
    }
    // Método para obter um estabelecimento pelo ID
    async getById(req, res) {
        const establishmentId = Number(req.params.id);
        if (isNaN(establishmentId)) {
            console.warn(`⚠️ ID do estabelecimento inválido: ${req.params.id}`);
            return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
        }
        try {
            const establishment = await establishmentService.getEstablishmentById(establishmentId);
            if (!establishment) {
                console.warn(`⚠️ Estabelecimento não encontrado para ID: ${establishmentId}`);
                return res.status(404).json({ error: 'Estabelecimento não encontrado.' });
            }
            return res.status(200).json(establishment);
        }
        catch (error) {
            console.error(`❌ Erro ao obter estabelecimento ID ${establishmentId}:`, error);
            return res.status(500).json({ error: 'Erro ao obter estabelecimento.' });
        }
    }
    // Método para obter todos os estabelecimentos
    async getAll(req, res) {
        try {
            const establishments = await establishmentService.getAllEstablishments();
            return res.status(200).json(establishments);
        }
        catch (error) {
            console.error(`❌ Erro ao obter estabelecimentos:`, error);
            return res.status(500).json({ error: 'Erro ao obter estabelecimentos.' });
        }
    }
    // Método para atualizar um estabelecimento
    async update(req, res) {
        const establishmentId = Number(req.params.id);
        const data = req.body;
        if (isNaN(establishmentId)) {
            console.warn(`⚠️ ID do estabelecimento inválido para atualização: ${req.params.id}`);
            return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
        }
        try {
            const updatedEstablishment = await establishmentService.updateEstablishment(establishmentId, data);
            return res.status(200).json(updatedEstablishment);
        }
        catch (error) {
            console.error(`❌ Erro ao atualizar estabelecimento ID ${establishmentId}:`, error);
            return res.status(500).json({ error: 'Erro ao atualizar estabelecimento.' });
        }
    }
    // Método para deletar um estabelecimento
    async delete(req, res) {
        const establishmentId = Number(req.params.id);
        if (isNaN(establishmentId)) {
            console.warn(`⚠️ ID do estabelecimento inválido para exclusão: ${req.params.id}`);
            return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
        }
        try {
            const deletedEstablishment = await establishmentService.deleteEstablishment(establishmentId);
            return res.status(200).json({ message: 'Estabelecimento excluído com sucesso.', establishment: deletedEstablishment });
        }
        catch (error) {
            console.error(`❌ Erro ao excluir estabelecimento ID ${establishmentId}:`, error);
            return res.status(500).json({ error: 'Erro ao excluir estabelecimento.' });
        }
    }
}
exports.EstablishmentController = EstablishmentController;
//# sourceMappingURL=EstablishmentController.js.map