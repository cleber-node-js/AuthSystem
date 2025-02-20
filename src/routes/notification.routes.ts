import { Router, Request, Response, NextFunction } from 'express';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();
const notificationController = new NotificationController();

// Ajuste das Rotas com Funções Anônimas
router.post('/notifications', (req: Request, res: Response, next: NextFunction) => {
  notificationController.createNotification(req, res).catch(next);
});
router.get('/notifications/user/:userId', (req: Request, res: Response, next: NextFunction) => {
  notificationController.getNotificationsByUserId(req, res).catch(next);
});
router.get('/notifications/artist/:artistId', (req: Request, res: Response, next: NextFunction) => {
  notificationController.getNotificationsByArtistId(req, res).catch(next);
});
router.get('/notifications/establishment/:establishmentId', (req: Request, res: Response, next: NextFunction) => {
  notificationController.getNotificationsByEstablishmentId(req, res).catch(next);
});
router.get('/notifications/:id', (req: Request, res: Response, next: NextFunction) => {
  notificationController.getNotificationById(req, res).catch(next);
});
router.put('/notifications/:id/read', (req: Request, res: Response, next: NextFunction) => {
  notificationController.markNotificationAsRead(req, res).catch(next);
});
router.delete('/notifications/:id', (req: Request, res: Response, next: NextFunction) => {
  notificationController.deleteNotification(req, res).catch(next);
});

export default router;
