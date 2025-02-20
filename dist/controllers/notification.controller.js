"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const notificationService = new notification_service_1.NotificationService();
class NotificationController {
    // CREATE - Create a new notification
    async createNotification(req, res) {
        try {
            const { userId, artistId, establishmentId, category, title, content, } = req.body;
            const notification = await notificationService.createNotification(userId, artistId, establishmentId, category, // Cast to NotificationCategory enum
            title, content);
            res.status(201).json(notification);
        }
        catch (error) {
            res.status(400).json({ message: error.message || 'Bad Request' });
        }
    }
    // READ - Get notifications by user ID
    async getNotificationsByUserId(req, res) {
        try {
            const userId = parseInt(req.params.userId, 10);
            const notifications = await notificationService.getNotificationsByUserId(userId);
            res.json(notifications);
        }
        catch (error) {
            res.status(404).json({ message: error.message || 'Notifications not found for user' });
        }
    }
    // READ - Get notifications by artist ID
    async getNotificationsByArtistId(req, res) {
        try {
            const artistId = parseInt(req.params.artistId, 10);
            const notifications = await notificationService.getNotificationsByArtistId(artistId);
            res.json(notifications);
        }
        catch (error) {
            res.status(404).json({ message: error.message || 'Notifications not found for artist' });
        }
    }
    // READ - Get notifications by establishment ID
    async getNotificationsByEstablishmentId(req, res) {
        try {
            const establishmentId = parseInt(req.params.establishmentId, 10);
            const notifications = await notificationService.getNotificationsByEstablishmentId(establishmentId);
            res.json(notifications);
        }
        catch (error) {
            res.status(404).json({ message: error.message || 'Notifications not found for establishment' });
        }
    }
    // READ - Get a notification by ID
    async getNotificationById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const notification = await notificationService.getNotificationById(id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.json(notification);
        }
        catch (error) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    // UPDATE - Mark a notification as read
    async markNotificationAsRead(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const updatedNotification = await notificationService.markNotificationAsRead(id);
            if (!updatedNotification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            res.json(updatedNotification);
        }
        catch (error) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    // DELETE - Delete a notification
    async deleteNotification(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            await notificationService.deleteNotification(id);
            res.status(204).send(); // No content - successful deletion
        }
        catch (error) {
            res.status(404).json({ message: error.message || 'Notification not found' });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map