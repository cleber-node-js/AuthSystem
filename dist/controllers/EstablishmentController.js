"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablishmentController = void 0;
const EstablishmentService_1 = require("../services/EstablishmentService");
const establishmentService = new EstablishmentService_1.EstablishmentService();
class EstablishmentController {
    // ✅ Criar estabelecimento com imagem e novos campos
    async create(req, res) {
        const { name, address, contact, latitude, longitude, categories } = req.body;
        const primaryOwnerId = req.userId;
        if (!primaryOwnerId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        // ✅ Gera URL pública da imagem corretamente
        const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : undefined;
        try {
            const establishment = await establishmentService.createEstablishment(name, address, contact, Number(primaryOwnerId), latitude, longitude, categories, imageUrl);
            return res.status(201).json(establishment);
        }
        catch (error) {
            console.error("❌ Erro ao criar estabelecimento:", error);
            return res.status(500).json({ error: "Erro ao criar estabelecimento." });
        }
    }
    // 🔍 Obter estabelecimento por ID
    async getById(req, res) {
        const establishmentId = parseInt(req.params.id, 10);
        if (isNaN(establishmentId) || establishmentId <= 0) {
            return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
        }
        try {
            const establishment = await establishmentService.getEstablishmentById(establishmentId);
            return res.status(200).json(establishment);
        }
        catch (error) {
            console.error('❌ Erro ao buscar estabelecimento:', error);
            return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
        }
    }
    // 🔍 Obter todos os estabelecimentos
    async getAll(req, res) {
        try {
            const establishments = await establishmentService.getAllEstablishments();
            return res.status(200).json(establishments);
        }
        catch (error) {
            console.error('❌ Erro ao listar estabelecimentos:', error);
            return res.status(500).json({ error: 'Erro ao listar estabelecimentos.' });
        }
    }
    // 🔍 Obter artistas por estabelecimento e status
    async getArtistsByEstablishment(req, res) {
        const establishmentId = parseInt(req.params.id, 10);
        const { status } = req.query;
        if (isNaN(establishmentId) || establishmentId <= 0) {
            return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
        }
        try {
            const artists = await establishmentService.getArtistsByEstablishmentAndStatus(establishmentId, status === null || status === void 0 ? void 0 : status.toString());
            return res.status(200).json(artists);
        }
        catch (error) {
            console.error('❌ Erro ao obter artistas:', error);
            return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
        }
    }
    // ✏️ Atualizar estabelecimento
    async update(req, res) {
        const establishmentId = parseInt(req.params.id, 10);
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (isNaN(establishmentId) || establishmentId <= 0) {
            return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
        }
        try {
            const establishment = await establishmentService.getEstablishmentById(establishmentId);
            if (establishment.primaryOwnerId !== Number(userId)) {
                return res.status(403).json({ error: 'Você não tem permissão para atualizar este estabelecimento.' });
            }
            const updated = await establishmentService.updateEstablishment(establishmentId, req.body);
            return res.status(200).json(updated);
        }
        catch (error) {
            console.error('❌ Erro ao atualizar estabelecimento:', error);
            return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
        }
    }
    // 🗑️ Excluir estabelecimento
    async delete(req, res) {
        const establishmentId = parseInt(req.params.id, 10);
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (isNaN(establishmentId) || establishmentId <= 0) {
            return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
        }
        try {
            const establishment = await establishmentService.getEstablishmentById(establishmentId);
            if (establishment.primaryOwnerId !== Number(userId)) {
                return res.status(403).json({ error: 'Você não tem permissão para excluir este estabelecimento.' });
            }
            const result = await establishmentService.deleteEstablishment(establishmentId);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error('❌ Erro ao excluir estabelecimento:', error);
            return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
        }
    }
    // ✅ Atualizar status do artista (APPROVED / REJECTED / PENDING / DECLINED / REFUNDED)
    async updateArtistStatus(req, res) {
        console.log("🔍 Params recebidos:", req.params);
        console.log("🔍 Body recebido:", req.body);
        const establishmentId = parseInt(req.params.establishmentId, 10) || parseInt(req.body.establishmentId, 10);
        const artistId = parseInt(req.params.artistId, 10) || parseInt(req.body.artistId, 10);
        const { status } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        if (isNaN(establishmentId) || isNaN(artistId)) {
            return res.status(400).json({ error: "ID do estabelecimento ou do artista inválido." });
        }
        if (!["APPROVED", "REJECTED", "PENDING", "DECLINED", "REFUNDED"].includes(status === null || status === void 0 ? void 0 : status.toUpperCase())) {
            return res.status(400).json({ error: "Status inválido. Use APPROVED, REJECTED, PENDING, DECLINED ou REFUNDED." });
        }
        try {
            const establishment = await establishmentService.getEstablishmentById(establishmentId);
            if (!establishment) {
                return res.status(404).json({ error: "Estabelecimento não encontrado." });
            }
            if (establishment.primaryOwnerId !== Number(userId)) {
                return res.status(403).json({ error: "Você não tem permissão para alterar artistas neste estabelecimento." });
            }
            const result = await establishmentService.updateArtistStatus(establishmentId, artistId, status.toUpperCase());
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("❌ Erro ao atualizar status do artista:", error);
            return res.status(500).json({ error: (error instanceof Error ? error.message : "Erro desconhecido") });
        }
    }
}
exports.EstablishmentController = EstablishmentController;
//# sourceMappingURL=EstablishmentController.js.map