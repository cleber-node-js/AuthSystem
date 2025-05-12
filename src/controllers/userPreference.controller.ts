// src/controllers/userPreference.controller.ts
import { Request, Response } from 'express';
import { UserPreferenceService } from '../services/userPreference.service';

export class UserPreferenceController {

    private readonly userPreferenceService = new UserPreferenceService();

    async getPreferencesByUserId(req: Request, res: Response) {
        try {
            const user_id = req.params.user_id;
            const userPreference = await this.userPreferenceService.getPreferencesByuser_id(Number(user_id));
            res.json(userPreference);
        } catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }

    async createPreferences(req: Request, res: Response) {
        try {
            const user_id = Number(req.params.user_id);
            const { interests, favoriteCategories } = req.body;
            const userPreference = await this.userPreferenceService.createPreferences(user_id, interests, favoriteCategories);
            res.status(201).json(userPreference);
        } catch (error) {
            res.status(400).json({ message: (error as any).message || 'Bad Request' });
        }
    }

    async updatePreferences(req: Request, res: Response) {
        try {
            const user_id = req.params.user_id;
            const data = req.body;
            const userPreference = await this.userPreferenceService.updatePreferences(Number(user_id), data);
            res.json(userPreference);
        } catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }

    async deletePreferences(req: Request, res: Response) {
        try {
            const user_id = req.params.user_id;
            await this.userPreferenceService.deletePreferences(Number(user_id));
            res.status(204).json({ message: 'User Preference deleted' });
        } catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }
}