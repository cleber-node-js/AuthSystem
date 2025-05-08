"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const session_routes_1 = __importDefault(require("./routes/session.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const artist_routes_1 = __importDefault(require("./routes/artist.routes"));
const establishment_routes_1 = __importDefault(require("./routes/establishment.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const favorite_routes_1 = __importDefault(require("./routes/favorite.routes"));
const classification_routes_1 = __importDefault(require("./routes/classification.routes"));
const rating_routes_1 = __importDefault(require("./routes/rating.routes"));
const userRole_routes_1 = __importDefault(require("./routes/userRole.routes"));
const auth_routes_1 = require("./routes/auth.routes");
const userPreference_routes_1 = __importDefault(require("./routes/userPreference.routes"));
const userVerificationToken_routes_1 = __importDefault(require("./routes/userVerificationToken.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Prefixando rotas (sem authMiddleware aqui)
app.use('/api', user_routes_1.default);
app.use('/api', artist_routes_1.default);
app.use('/api', establishment_routes_1.default);
app.use('/api', category_routes_1.default);
// Rotas que não precisam de autenticação
app.use('/auth', auth_routes_1.authRoutes); // Rotas de autenticação (register, login)
// Rotas que não pertencem ao api
app.use('/sessions', session_routes_1.default);
app.use('/events', event_routes_1.default);
app.use('/favorites', favorite_routes_1.default);
app.use('/classifications', classification_routes_1.default);
app.use('/ratings', rating_routes_1.default);
app.use('/user-roles', userRole_routes_1.default);
app.use('/api', userPreference_routes_1.default);
app.use('/api', userVerificationToken_routes_1.default);
app.use('/api', notification_routes_1.default);
app.get('/', (_req, res) => {
    res.send('API rodando no subdomínio api.bizzinpro.com.br!');
});
// Tratamento de erros
const errorHandler = (err, _req, res, _next) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ message: 'Erro interno no servidor', error: err.message });
};
app.use(errorHandler);
//# sourceMappingURL=app.js.map