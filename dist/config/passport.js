"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Certifique-se de que estas variáveis estão definidas em seu .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, async (req, _accessToken, _refreshToken, profile, done) => {
    var _a;
    try {
        const email = profile.emails && ((_a = profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value); // Adiciona verificação para evitar erros
        const displayName = profile.displayName;
        if (!email) {
            return done(new Error('Email not provided'), false); // Verificação adicional
        }
        let user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: email,
                    name: displayName,
                    profileType: 'CLIENT', // Use o valor correto conforme seu Enum
                    status: 'ACTIVE', // Use o valor correto conforme seu Enum
                    password: 'your_password_here', // É recomendável não armazenar senhas que não sejam criptografadas
                    // Adicione outros campos conforme necessário
                }
            });
        }
        done(null, user);
    }
    catch (error) {
        console.error("Error in Google Strategy:", error);
        done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id); // Usa o ID do usuário para serialização
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const userId = parseInt(id, 10); // Convert the id from string to number
        const user = await prisma.user.findUnique({
            where: { id: userId } // Use the converted id
        });
        done(null, user);
    }
    catch (error) {
        console.error("Error while deserializing user:", error);
        done(error, null);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map