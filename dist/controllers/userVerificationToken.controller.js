"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userVerificationToken_service_1 = require("../services/userVerificationToken.service");
class UserVerificationTokenController {
    constructor() {
        this.userVerificationTokenService = new userVerificationToken_service_1.UserVerificationTokenService();
    }
    async create(req, res) {
        try {
            const { userId, token, expiresAt } = req.body;
            const userVerificationToken = await this.userVerificationTokenService.createToken(userId, token, expiresAt);
            res.status(201).json(userVerificationToken);
        }
        catch (error) {
            res.status(400).json({ message: error.message || 'Bad Request' });
        }
    }
    async getTokenByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const userVerificationToken = await this.userVerificationTokenService.getTokenByUserId(Number(userId));
            res.json(userVerificationToken);
        }
        catch (error) {
            res.status(404).json({ message: 'User Verification Token not found' });
        }
    }
    async getTokenByToken(req, res) {
        try {
            const token = req.params.token;
            const userVerificationToken = await this.userVerificationTokenService.getTokenByToken(token);
            res.json(userVerificationToken);
        }
        catch (error) {
            res.status(404).json({ message: 'User Verification Token not found' });
        }
    }
    async delete(req, res) {
        try {
            const userId = req.params.userId;
            await this.userVerificationTokenService.deleteToken(Number(userId));
            res.status(204).json({ message: 'User Verification Token deleted' });
        }
        catch (error) {
            res.status(404).json({ message: 'User Verification Token not found' });
        }
    }
    async verify(req, res) {
        try {
            const token = req.params.token;
            const isValid = await this.userVerificationTokenService.verifyToken(token);
            res.json({ isValid });
        }
        catch (error) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
exports.default = UserVerificationTokenController;
//# sourceMappingURL=userVerificationToken.controller.js.map