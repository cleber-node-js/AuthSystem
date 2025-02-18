// src/controllers/userPreference.controller.ts
import { Request, Response } from 'express';
import { UserPreferenceService } from '../services/userPreference.service';

export class UserPreferenceController {

    private readonly userPreferenceService = new UserPreferenceService();

    async getPreferencesByUserId(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const userPreference = await this.userPreferenceService.getPreferencesByUserId(Number(userId));
            res.json(userPreference);
        } catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }

    async createPreferences(req: Request, res: Response) {
        try {
            const userId = Number(req.params.userId); // Obtém userId da rota
            const { interests, favoriteCategories } = req.body;
            const userPreference = await this.userPreferenceService.createPreferences(userId, interests, favoriteCategories);
            res.status(201).json(userPreference);
        } catch (error) {
            res.status(400).json({ message: (error as any).message || 'Bad Request' });
        }
    }

    async updatePreferences(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const data = req.body;
            const userPreference = await this.userPreferenceService.updatePreferences(Number(userId), data);
            res.json(userPreference);
        } catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }

    async deletePreferences(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            await this.userPreferenceService.deletePreferences(Number(userId));
            res.status(204).json({ message: 'User Preference deleted' });
        } catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }
}