import { Router } from 'express';
import UserVerificationTokenController from '../controllers/userVerificationToken.controller';

const router = Router();
const userVerificationTokenController = new UserVerificationTokenController();

// Rota para criar um token de verificação de usuário
router.post('/tokens', userVerificationTokenController.create.bind(userVerificationTokenController));

// Rota para obter um token de verificação de usuário por ID de usuário
router.get('/tokens/user/:userId', userVerificationTokenController.getTokenByUserId.bind(userVerificationTokenController));

// Rota para obter um token de verificação de usuário por token
router.get('/tokens/:token', userVerificationTokenController.getTokenByToken.bind(userVerificationTokenController));

// Rota para deletar um token de verificação de usuário
router.delete('/tokens/user/:userId', userVerificationTokenController.delete.bind(userVerificationTokenController));

// Rota para verificar se um token é válido
router.get('/tokens/verify/:token', userVerificationTokenController.verify.bind(userVerificationTokenController));

export default router;