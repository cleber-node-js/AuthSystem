import { Request, Response } from 'express';
import { UserVerificationTokenService } from '../services/userVerificationToken.service';

class UserVerificationTokenController {
    private readonly userVerificationTokenService = new UserVerificationTokenService();

    async create(req: Request, res: Response) {
        try {
            const { userId, token, expiresAt } = req.body;
            const userVerificationToken = await this.userVerificationTokenService.createToken(userId, token, expiresAt);
            res.status(201).json(userVerificationToken);
        } catch (error) {
            res.status(400).json({ message: (error as any).message || 'Bad Request' });
        }
    }

    async getTokenByUserId(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const userVerificationToken = await this.userVerificationTokenService.getTokenByUserId(Number(userId));
            res.json(userVerificationToken);
        } catch (error) {
            res.status(404).json({ message: 'User Verification Token not found' });
        }
    }

    async getTokenByToken(req: Request, res: Response) {
        try {
            const token = req.params.token;
            const userVerificationToken = await this.userVerificationTokenService.getTokenByToken(token);
            res.json(userVerificationToken);
        } catch (error) {
            res.status(404).json({ message: 'User Verification Token not found' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            await this.userVerificationTokenService.deleteToken(Number(userId));
            res.status(204).json({ message: 'User Verification Token deleted' });
        } catch (error) {
            res.status(404).json({ message: 'User Verification Token not found' });
        }
    }

    async verify(req: Request, res: Response) {
        try {
            const token = req.params.token;
            const isValid = await this.userVerificationTokenService.verifyToken(token);
            res.json({ isValid });
        } catch (error) {
            res.status(500).json({ message: (error as any).message || 'Internal Server Error' });
        }
    }
}

export default UserVerificationTokenController;