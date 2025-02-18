"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const authController = new AuthController_1.AuthController();
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.get('/users', authMiddleware_1.authMiddleware, authController.getAllUsers);
//# sourceMappingURL=authRoutes.js.map