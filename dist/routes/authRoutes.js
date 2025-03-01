"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const authController = new AuthController_1.AuthController();
// Tipagem do controlador
authRoutes.post('/register', async (request, response) => {
    try {
        await authController.register(request, response);
    }
    catch (err) { // Add type annotation for 'err'
        if (!response.headersSent) { // Verifica se a resposta já foi enviada
            response.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
});
authRoutes.post('/login', async (request, response) => {
    try {
        await authController.login(request, response);
    }
    catch (err) { // Add type annotation for 'err'
        if (!response.headersSent) {
            response.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
});
authRoutes.get('/users', authMiddleware_1.authMiddleware, async (request, response) => {
    try {
        await authController.getAllUsers(request, response);
    }
    catch (err) { // Add type annotation for 'err'
        if (!response.headersSent) {
            response.status(500).json({ message: 'Internal server error', error: err.message });
        }
    }
});
//# sourceMappingURL=authRoutes.js.map