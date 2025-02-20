"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userVerificationToken_controller_1 = __importDefault(require("../controllers/userVerificationToken.controller"));
const router = (0, express_1.Router)();
const userVerificationTokenController = new userVerificationToken_controller_1.default();
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
exports.default = router;
//# sourceMappingURL=userVerificationTokenRoutes.js.map