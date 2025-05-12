import { Request, Response } from 'express';
import { FavoriteService } from '../services/FavoriteService';

const favoriteService = new FavoriteService();

export class FavoriteController {
    async addFavorite(req: Request, res: Response): Promise<Response> {
        const { user_id, event_id } = req.body;
        try {
            const favorite = await favoriteService.addFavorite(user_id, event_id);
            console.log('Favorite added:', favorite);  // Imprimir no terminal
            return res.status(201).json(favorite);
        } catch (error: any) {
            console.error('Error adding favorite:', error.message);  // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }

    async getUserFavorites(req: Request, res: Response): Promise<Response> {
        const user_id = Number(req.params.user_id);
        try {
            const favorites = await favoriteService.getFavoritesByUser(user_id);
            console.log('User favorites:', favorites);  // Imprimir no terminal
            return res.status(200).json(favorites);
        } catch (error: any) {
            console.error('Error getting user favorites:', error.message);  // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }

    async removeFavorite(req: Request, res: Response): Promise<Response> {
        const favoriteId = Number(req.params.id);
        try {
            const deletedFavorite = await favoriteService.removeFavorite(favoriteId);
            console.log('Favorite removed:', deletedFavorite);  // Imprimir no terminal
            return res.status(200).json(deletedFavorite);
        } catch (error: any) {
            console.error('Error removing favorite:', error.message);  // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllFavorites(req: Request, res: Response): Promise<Response> {
        try {
            const favorites = await favoriteService.getAllFavorites();
            console.log('All favorites:', favorites);  // Imprimir no terminal
            return res.status(200).json(favorites);
        } catch (error: any) {
            console.error('Error getting all favorites:', error.message);  // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }
    // 🚀 Método adicionado para corrigir erro
    async checkFavorite(req: Request, res: Response): Promise<Response> {
        const user_id = Number(req.query.user_id);
        const event_id = Number(req.query.event_id);
        
        console.log(`Checking favorite for user_id: ${user_id} and event_id: ${event_id}`);
        
        try {
            const favorite = await favoriteService.checkFavorite(user_id, event_id);
            console.log('Favorite check result:', favorite);  // Imprimir no terminal
            return res.status(200).json(favorite);
        } catch (error: any) {
            console.error('Error checking favorite:', error.message);  // Imprimir erro no terminal
            return res.status(400).json({ error: error.message });
        }
    }
}
