"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
// Ajuste das Rotas com Funções Anônimas
router.post('/payments', (req, res, next) => {
    paymentController.processPayment(req, res).catch(next);
});
router.post('/subscriptions', (req, res, next) => {
    paymentController.createSubscription(req, res).catch(next);
});
router.get('/transactions/user/:userId', (req, res, next) => {
    paymentController.getTransactionsByUserId(req, res).catch(next);
});
router.get('/transactions/artist/:artistId', (req, res, next) => {
    paymentController.getTransactionsByArtistId(req, res).catch(next);
});
router.get('/transactions/establishment/:establishmentId', (req, res, next) => {
    paymentController.getTransactionsByEstablishmentId(req, res).catch(next);
});
router.get('/subscriptions/user/:userId', (req, res, next) => {
    paymentController.getSubscriptionsByUserId(req, res).catch(next);
});
router.get('/subscriptions/artist/:artistId', (req, res, next) => {
    paymentController.getSubscriptionsByArtistId(req, res).catch(next);
});
router.get('/subscriptions/establishment/:establishmentId', (req, res, next) => {
    paymentController.getSubscriptionsByEstablishmentId(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map