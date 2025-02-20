"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const sessionRoutes_1 = __importDefault(require("./routes/sessionRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const artistRoutes_1 = __importDefault(require("./routes/artistRoutes"));
const establishment_routes_1 = __importDefault(require("./routes/establishment.routes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const classificationRoutes_1 = __importDefault(require("./routes/classificationRoutes"));
const ratingRoutes_1 = __importDefault(require("./routes/ratingRoutes"));
const userRoleRoutes_1 = __importDefault(require("./routes/userRoleRoutes"));
const authRoutes_1 = require("./routes/authRoutes");
const userPreference_routes_1 = __importDefault(require("./routes/userPreference.routes"));
const userVerificationTokenRoutes_1 = __importDefault(require("./routes/userVerificationTokenRoutes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Prefixando rotas (sem authMiddleware aqui)
app.use('/api', userRoutes_1.default);
app.use('/api', artistRoutes_1.default);
app.use('/api', establishment_routes_1.default);
// Rotas que não precisam de autenticação
app.use('/auth', authRoutes_1.authRoutes); // Rotas de autenticação (register, login)
//Rotas que não pertencem ao api
app.use('/sessions', sessionRoutes_1.default);
app.use('/events', eventRoutes_1.default);
app.use('/favorites', favoriteRoutes_1.default);
app.use('/classifications', classificationRoutes_1.default);
app.use('/ratings', ratingRoutes_1.default);
app.use('/user-roles', userRoleRoutes_1.default);
app.use('/api', userPreference_routes_1.default);
app.use('/api', userVerificationTokenRoutes_1.default);
app.use('/api', notification_routes_1.default);
app.use('/api', payment_routes_1.default);
// Tratamento de erros
const errorHandler = (err, _req, res, _next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
};
app.use(errorHandler);
//# sourceMappingURL=app.js.map