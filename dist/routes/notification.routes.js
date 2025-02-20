"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
const notificationController = new notification_controller_1.NotificationController();
// Ajuste das Rotas com Funções Anônimas
router.post('/notifications', (req, res, next) => {
    notificationController.createNotification(req, res).catch(next);
});
router.get('/notifications/user/:userId', (req, res, next) => {
    notificationController.getNotificationsByUserId(req, res).catch(next);
});
router.get('/notifications/artist/:artistId', (req, res, next) => {
    notificationController.getNotificationsByArtistId(req, res).catch(next);
});
router.get('/notifications/establishment/:establishmentId', (req, res, next) => {
    notificationController.getNotificationsByEstablishmentId(req, res).catch(next);
});
router.get('/notifications/:id', (req, res, next) => {
    notificationController.getNotificationById(req, res).catch(next);
});
router.put('/notifications/:id/read', (req, res, next) => {
    notificationController.markNotificationAsRead(req, res).catch(next);
});
router.delete('/notifications/:id', (req, res, next) => {
    notificationController.deleteNotification(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=notification.routes.js.map