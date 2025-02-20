"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../services/payment.service");
const paymentService = new payment_service_1.PaymentService();
class PaymentController {
    async processPayment(req, res) {
        try {
            const { userId, artistId, establishmentId, amount, receiptEmail } = req.body;
            const transaction = await paymentService.processPayment({
                userId,
                artistId,
                establishmentId,
                amount,
                receiptEmail,
            });
            return res.status(201).json(transaction);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async createSubscription(req, res) {
        try {
            const { userId, artistId, establishmentId, plan, endDate } = req.body;
            const subscription = await paymentService.createSubscription({
                userId,
                artistId,
                establishmentId,
                plan,
                endDate: new Date(endDate),
            });
            return res.status(201).json(subscription);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getTransactionsByUserId(req, res) {
        try {
            const { userId } = req.params;
            const transactions = await paymentService.getTransactionsByUserId(Number(userId));
            return res.status(200).json(transactions);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getTransactionsByArtistId(req, res) {
        try {
            const { artistId } = req.params;
            const transactions = await paymentService.getTransactionsByArtistId(Number(artistId));
            return res.status(200).json(transactions);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getTransactionsByEstablishmentId(req, res) {
        try {
            const { establishmentId } = req.params;
            const transactions = await paymentService.getTransactionsByEstablishmentId(Number(establishmentId));
            return res.status(200).json(transactions);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getSubscriptionsByUserId(req, res) {
        try {
            const { userId } = req.params;
            const subscriptions = await paymentService.getSubscriptionsByUserId(Number(userId));
            return res.status(200).json(subscriptions);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getSubscriptionsByArtistId(req, res) {
        try {
            const { artistId } = req.params;
            const subscriptions = await paymentService.getSubscriptionsByArtistId(Number(artistId));
            return res.status(200).json(subscriptions);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getSubscriptionsByEstablishmentId(req, res) {
        try {
            const { establishmentId } = req.params;
            const subscriptions = await paymentService.getSubscriptionsByEstablishmentId(Number(establishmentId));
            return res.status(200).json(subscriptions);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map