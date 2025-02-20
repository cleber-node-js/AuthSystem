"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingController = void 0;
const RatingService_1 = require("../services/RatingService");
const ratingService = new RatingService_1.RatingService();
class RatingController {
    async createRating(req, res) {
        const { eventId, userId, score, comment } = req.body;
        console.log(`📌 Recebendo requisição para criar avaliação:`, { eventId, userId, score, comment });
        try {
            const newRating = await ratingService.createRating(eventId, userId, score, comment);
            console.log(`✅ Avaliação criada com sucesso! ID: ${newRating.id}`);
            return res.status(201).json(newRating);
        }
        catch (error) {
            console.error(`❌ Erro ao criar avaliação: ${error.message}`);
            return res.status(400).json({ error: 'Erro ao criar avaliação. Verifique os dados enviados.' });
        }
    }
    async getAllRatings(req, res) {
        console.log('📌 Buscando todas as avaliações...');
        try {
            const ratings = await ratingService.getAllRatings();
            console.table(ratings); // Exibe os resultados em formato de tabela no terminal
            return res.status(200).json(ratings);
        }
        catch (error) {
            console.error(`❌ Erro ao buscar avaliações: ${error.message}`);
            return res.status(400).json({ error: 'Erro ao buscar avaliações.' });
        }
    }
    async getRatingById(req, res) {
        const id = Number(req.params.id);
        console.log(`📌 Buscando avaliação com ID: ${id}`);
        try {
            const rating = await ratingService.getRatingById(id);
            if (!rating) {
                console.warn(`⚠️ Avaliação com ID ${id} não encontrada.`);
                return res.status(404).json({ error: 'Avaliação não encontrada' });
            }
            console.log(`✅ Avaliação encontrada:`, rating);
            return res.status(200).json(rating);
        }
        catch (error) {
            console.error(`❌ Erro ao buscar avaliação com ID ${id}: ${error.message}`);
            return res.status(400).json({ error: 'Erro ao buscar avaliação.' });
        }
    }
    async updateRating(req, res) {
        const id = Number(req.params.id);
        const { eventId, userId, score, comment } = req.body;
        console.log(`📌 Atualizando avaliação com ID ${id}`, { eventId, userId, score, comment });
        try {
            const updatedRating = await ratingService.updateRating(id, eventId, userId, score, comment);
            console.log(`✅ Avaliação ID ${id} atualizada com sucesso.`);
            return res.status(200).json(updatedRating);
        }
        catch (error) {
            console.error(`❌ Erro ao atualizar avaliação com ID ${id}: ${error.message}`);
            return res.status(400).json({ error: 'Erro ao atualizar avaliação.' });
        }
    }
    async deleteRating(req, res) {
        const id = Number(req.params.id);
        console.log(`📌 Deletando avaliação com ID: ${id}`);
        try {
            const deletedRating = await ratingService.deleteRating(id);
            console.log(`✅ Avaliação ID ${id} deletada com sucesso.`);
            return res.status(200).json(deletedRating);
        }
        catch (error) {
            console.error(`❌ Erro ao deletar avaliação com ID ${id}: ${error.message}`);
            return res.status(400).json({ error: 'Erro ao deletar avaliação.' });
        }
    }
}
exports.RatingController = RatingController;
//# sourceMappingURL=RatingController.js.map