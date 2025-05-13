import { PrismaClient, Notification, NotificationCategory } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationService {
  // CREATE - Create a new notification
  async createNotification(
    user_id: number | null,
    artist_id: number | null,
    establishment_id: number | null,
    category: NotificationCategory,
    title: string,
    content: string,
  ): Promise<Notification> {
    return prisma.notification.create({
      data: {
        user_id,
        artist_id,
        establishment_id,
        category,
        title,
        content,
      },
    });
  }

  // READ - Get notifications by user ID
  async getNotificationsByUserId(user_id: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { user_id },
      orderBy: { createdAt: 'desc' }, // Order by most recent
    });
  }

  // READ - Get notifications by artist ID
  async getNotificationsByArtistId(artist_id: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { artist_id },
      orderBy: { createdAt: 'desc' },
    });
  }

  // READ - Get notifications by establishment ID
  async getNotificationsByEstablishmentId(establishment_id: number): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: { establishment_id },
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