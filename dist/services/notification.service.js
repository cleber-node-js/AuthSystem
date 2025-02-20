"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotificationService {
    // CREATE - Create a new notification
    async createNotification(userId, artistId, establishmentId, category, title, content) {
        return prisma.notification.create({
            data: {
                userId,
                artistId,
                establishmentId,
                category,
                title,
                content,
            },
        });
    }
    // READ - Get notifications by user ID
    async getNotificationsByUserId(userId) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, // Order by most recent
        });
    }
    // READ - Get notifications by artist ID
    async getNotificationsByArtistId(artistId) {
        return prisma.notification.findMany({
            where: { artistId },
            orderBy: { createdAt: 'desc' },
        });
    }
    // READ - Get notifications by establishment ID
    async getNotificationsByEstablishmentId(establishmentId) {
        return prisma.notification.findMany({
            where: { establishmentId },
            orderBy: { createdAt: 'desc' },
        });
    }
    // READ - Get a notification by ID
    async getNotificationById(id) {
        return prisma.notification.findUnique({
            where: { id },
        });
    }
    // UPDATE - Mark a notification as read
    async markNotificationAsRead(id) {
        return prisma.notification.update({
            where: { id },
            data: { read: true },
        });
    }
    // DELETE - Delete a notification
    async deleteNotification(id) {
        await prisma.notification.delete({
            where: { id },
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map