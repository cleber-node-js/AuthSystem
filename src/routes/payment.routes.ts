// import { Router, Request, Response, NextFunction } from 'express';
// import { PaymentController } from '../controllers/payment.controller';

// const router = Router();
// const paymentController = new PaymentController();

// // Ajuste das Rotas com Funções Anônimas
// router.post('/payments', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.processPayment(req, res).catch(next);
// });

// router.post('/subscriptions', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.createSubscription(req, res).catch(next);
// });

// router.get('/transactions/user/:userId', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.getTransactionsByUserId(req, res).catch(next);
// });

// router.get('/transactions/artist/:artistId', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.getTransactionsByArtistId(req, res).catch(next);
// });

// router.get('/transactions/establishment/:establishmentId', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.getTransactionsByEstablishmentId(req, res).catch(next);
// });

// router.get('/subscriptions/user/:userId', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.getSubscriptionsByUserId(req, res).catch(next);
// });

// router.get('/subscriptions/artist/:artistId', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.getSubscriptionsByArtistId(req, res).catch(next);
// });

// router.get('/subscriptions/establishment/:establishmentId', (req: Request, res: Response, next: NextFunction) => {
//   paymentController.getSubscriptionsByEstablishmentId(req, res).catch(next);
// });

// export default router;
