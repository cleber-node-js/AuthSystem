"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const FavoriteService_1 = require("../services/FavoriteService");
const favoriteService = new FavoriteService_1.FavoriteService();
class FavoriteController {
    async addFavorite(req, res) {
        const { userId, eventId } = req.body;
        try {
            const favorite = await favoriteService.addFavorite(userId, eventId);
            console.log('Favorite added:', favorite); // Imprimir no terminal
            return res.status(201).json(favorite);
        }
        catch (error) {
            console.error('Error adding favorite:', error.message); // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }
    async getUserFavorites(req, res) {
        const userId = Number(req.params.userId);
        try {
            const favorites = await favoriteService.getFavoritesByUser(userId);
            console.log('User favorites:', favorites); // Imprimir no terminal
            return res.status(200).json(favorites);
        }
        catch (error) {
            console.error('Error getting user favorites:', error.message); // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }
    async removeFavorite(req, res) {
        const favoriteId = Number(req.params.id);
        try {
            const deletedFavorite = await favoriteService.removeFavorite(favoriteId);
            console.log('Favorite removed:', deletedFavorite); // Imprimir no terminal
            return res.status(200).json(deletedFavorite);
        }
        catch (error) {
            console.error('Error removing favorite:', error.message); // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }
    async getAllFavorites(req, res) {
        try {
            const favorites = await favoriteService.getAllFavorites();
            console.log('All favorites:', favorites); // Imprimir no terminal
            return res.status(200).json(favorites);
        }
        catch (error) {
            console.error('Error getting all favorites:', error.message); // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }
    // 🚀 Método adicionado para corrigir erro
    async checkFavorite(req, res) {
        const userId = Number(req.query.userId);
        const eventId = Number(req.query.eventId);
        console.log(`Checking favorite for userId: ${userId} and eventId: ${eventId}`);
        try {
            const favorite = await favoriteService.checkFavorite(userId, eventId);
            console.log('Favorite check result:', favorite); // Imprimir no terminal
            return res.status(200).json(favorite);
        }
        catch (error) {
            console.error('Error checking favorite:', error.message); // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.FavoriteController = FavoriteController;
//# sourceMappingURL=FavoriteController.js.map