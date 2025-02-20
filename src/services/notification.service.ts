import { PrismaClient, Notification, NotificationCategory } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  // CREATE - Create a new notification
  async createNotification(
    userId: number | null,
    artistId: number | null,
    establishmentId: number | null,
    category: NotificationCategory,
    title: string,
    content: string,
  ): Promise<Notification> {
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
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // Order by most recent
    });
  }

  // READ - Get notifications by artist ID
  async getNotificationsByArtistId(artistId: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // READ - Get notifications by establishment ID
  async getNotificationsByEstablishmentId(establishmentId: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { establishmentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // READ - Get a notification by ID
  async getNotificationById(id: number): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  // UPDATE - Mark a notification as read
  async markNotificationAsRead(id: number): Promise<Notification | null> {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  // DELETE - Delete a notification
  async deleteNotification(id: number): Promise<void> {
    await prisma.notification.delete({
      where: { id },
    });
  }
}