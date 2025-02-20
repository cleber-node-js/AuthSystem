import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { NotificationCategory } from '@prisma/client';

const notificationService = new NotificationService();

export class NotificationController {
  // CREATE - Create a new notification
  async createNotification(req: Request, res: Response) {
    try {
      const {
        userId,
        artistId,
        establishmentId,
        category,
        title,
        content,
      } = req.body;

      const notification = await notificationService.createNotification(
        userId,
        artistId,
        establishmentId,
        category as NotificationCategory, // Cast to NotificationCategory enum
        title,
        content,
      );

      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Bad Request' });
    }
  }

  // READ - Get notifications by user ID
  async getNotificationsByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const notifications = await notificationService.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Notifications not found for user' });
    }
  }

  // READ - Get notifications by artist ID
  async getNotificationsByArtistId(req: Request, res: Response) {
    try {
      const artistId = parseInt(req.params.artistId, 10);
      const notifications = await notificationService.getNotificationsByArtistId(artistId);
      res.json(notifications);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Notifications not found for artist' });
    }
  }

  // READ - Get notifications by establishment ID
  async getNotificationsByEstablishmentId(req: Request, res: Response) {
    try {
      const establishmentId = parseInt(req.params.establishmentId, 10);
      const notifications = await notificationService.getNotificationsByEstablishmentId(establishmentId);
      res.json(notifications);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Notifications not found for establishment' });
    }
  }

  // READ - Get a notification by ID
  async getNotificationById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const notification = await notificationService.getNotificationById(id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json(notification);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  // UPDATE - Mark a notification as read
  async markNotificationAsRead(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedNotification = await notificationService.markNotificationAsRead(id);
      if (!updatedNotification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.json(updatedNotification);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  // DELETE - Delete a notification
  async deleteNotification(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      await notificationService.deleteNotification(id);
      res.status(204).send(); // No content - successful deletion
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Notification not found' });
    }
  }
}