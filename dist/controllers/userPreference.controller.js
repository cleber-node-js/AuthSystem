"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceController = void 0;
const userPreference_service_1 = require("../services/userPreference.service");
class UserPreferenceController {
    constructor() {
        this.userPreferenceService = new userPreference_service_1.UserPreferenceService();
    }
    async getPreferencesByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const userPreference = await this.userPreferenceService.getPreferencesByUserId(Number(userId));
            res.json(userPreference);
        }
        catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }
    async createPreferences(req, res) {
        try {
            const userId = Number(req.params.userId); // Obtém userId da rota
            const { interests, favoriteCategories } = req.body;
            const userPreference = await this.userPreferenceService.createPreferences(userId, interests, favoriteCategories);
            res.status(201).json(userPreference);
        }
        catch (error) {
            res.status(400).json({ message: error.message || 'Bad Request' });
        }
    }
    async updatePreferences(req, res) {
        try {
            const userId = req.params.userId;
            const data = req.body;
            const userPreference = await this.userPreferenceService.updatePreferences(Number(userId), data);
            res.json(userPreference);
        }
        catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }
    async deletePreferences(req, res) {
        try {
            const userId = req.params.userId;
            await this.userPreferenceService.deletePreferences(Number(userId));
            res.status(204).json({ message: 'User Preference deleted' });
        }
        catch (error) {
            res.status(404).json({ message: 'User Preference not found' });
        }
    }
}
exports.UserPreferenceController = UserPreferenceController;
//# sourceMappingURL=userPreference.controller.js.map