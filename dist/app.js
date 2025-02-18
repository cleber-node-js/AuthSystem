"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
//import sessionRoutes from './routes/sessionRoutes';
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
//import artistRoutes from './routes/artistRoutes';
//import establishmentRoutes from './routes/establishment.routes';
//import eventRoutes from './routes/eventRoutes';
//import favoriteRoutes from './routes/favoriteRoutes';
//import classificationRoutes from './routes/classificationRoutes';
//import ratingRoutes from './routes/ratingRoutes';
const userRoleRoutes_1 = __importDefault(require("./routes/userRoleRoutes"));
const authRoutes_1 = require("./routes/authRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Prefixando rotas (sem authMiddleware aqui)
app.use('/api', userRoutes_1.default);
//app.use('/api', artistRoutes);
//app.use('/api', establishmentRoutes);
// Rotas que não precisam de autenticação
app.use('/auth', authRoutes_1.authRoutes); // Rotas de autenticação (register, login)
//Rotas que não pertencem ao api
//app.use('/sessions', sessionRoutes);
//app.use('/events', eventRoutes);
//app.use('/favorites', favoriteRoutes);
//app.use('/classifications', classificationRoutes);
//app.use('/ratings', ratingRoutes);
app.use('/user-roles', userRoleRoutes_1.default);
// Tratamento de erros
const errorHandler = (err, _req, res, _next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
};
app.use(errorHandler);
//# sourceMappingURL=app.js.map