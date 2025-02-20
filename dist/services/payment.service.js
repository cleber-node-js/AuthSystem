"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);
const prisma = new client_1.PrismaClient();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15', // Verifique se este valor está correto na sua configuração
});
class PaymentService {
    async processPayment(data) {
        var _a, _b, _c;
        // Criação do Payment Intent usando a API do Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: data.amount * 100, // O valor deve estar em centavos
            currency: 'usd',
            receipt_email: data.receiptEmail,
        });
        // Obtendo a URL do recibo de pagamento
        const receiptUrl = paymentIntent.charges && paymentIntent.charges.data.length > 0
            ? paymentIntent.charges.data[0].receipt_url
            : null; // Se não houver cobrança, será null
        // Criação da transação no banco de dados usando Prisma
        const transaction = await prisma.transaction.create({
            data: {
                userId: (_a = data.userId) !== null && _a !== void 0 ? _a : null, // Converte undefined para null
                artistId: (_b = data.artistId) !== null && _b !== void 0 ? _b : null,
                establishmentId: (_c = data.establishmentId) !== null && _c !== void 0 ? _c : null,
                amount: data.amount,
                status: paymentIntent.status, // Status do Payment Intent do Stripe
                receiptUrl, // Atribuindo a URL do recibo corretamente
            },
        });
        return transaction; // Retorna a transação criada
    }
    async createSubscription(data) {
        var _a, _b, _c;
        const subscription = await prisma.subscription.create({
            data: {
                userId: (_a = data.userId) !== null && _a !== void 0 ? _a : null,
                artistId: (_b = data.artistId) !== null && _b !== void 0 ? _b : null,
                establishmentId: (_c = data.establishmentId) !== null && _c !== void 0 ? _c : null,
                plan: data.plan,
                status: 'active',
                endDate: data.endDate,
            },
        });
        return subscription;
    }
    async getTransactionsByUserId(userId) {
        return prisma.transaction.findMany({ where: { userId } });
    }
    async getTransactionsByArtistId(artistId) {
        return prisma.transaction.findMany({ where: { artistId } });
    }
    async getTransactionsByEstablishmentId(establishmentId) {
        return prisma.transaction.findMany({ where: { establishmentId } });
    }
    async getSubscriptionsByUserId(userId) {
        return prisma.subscription.findMany({ where: { userId } });
    }
    async getSubscriptionsByArtistId(artistId) {
        return prisma.subscription.findMany({ where: { artistId } });
    }
    async getSubscriptionsByEstablishmentId(establishmentId) {
        return prisma.subscription.findMany({ where: { establishmentId } });
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map