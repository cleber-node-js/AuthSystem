// import { Request, Response } from 'express';
// import { PaymentService } from '../services/payment.service';

// const paymentService = new PaymentService();

// export class PaymentController {
//   async processPayment(req: Request, res: Response): Promise<Response> {
//     try {
//       const { userId, artistId, establishmentId, amount, receiptEmail } = req.body;
//       const transaction = await paymentService.processPayment({
//         userId,
//         artistId,
//         establishmentId,
//         amount,
//         receiptEmail,
//       });
//       return res.status(201).json(transaction);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }    
//   }

//   async createSubscription(req: Request, res: Response): Promise<Response> {
//     try {
//       const { userId, artistId, establishmentId, plan, endDate } = req.body;
//       const subscription = await paymentService.createSubscription({
//         userId,
//         artistId,
//         establishmentId,
//         plan,
//         endDate: new Date(endDate),
//       });
//       return res.status(201).json(subscription);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }
    
//   }

//   async getTransactionsByUserId(req: Request, res: Response): Promise<Response> {
//     try {
//       const { userId } = req.params;
//       const transactions = await paymentService.getTransactionsByUserId(Number(userId));
//       return res.status(200).json(transactions);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }    
//   }

//   async getTransactionsByArtistId(req: Request, res: Response): Promise<Response> {
//     try {
//       const { artistId } = req.params;
//       const transactions = await paymentService.getTransactionsByArtistId(Number(artistId));
//       return res.status(200).json(transactions);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }    
//   }

//   async getTransactionsByEstablishmentId(req: Request, res: Response): Promise<Response> {
//     try {
//       const { establishmentId } = req.params;
//       const transactions = await paymentService.getTransactionsByEstablishmentId(Number(establishmentId));
//       return res.status(200).json(transactions);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }    
//   }

//   async getSubscriptionsByUserId(req: Request, res: Response): Promise<Response> {
//     try {
//       const { userId } = req.params;
//       const subscriptions = await paymentService.getSubscriptionsByUserId(Number(userId));
//       return res.status(200).json(subscriptions);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }    
//   }

//   async getSubscriptionsByArtistId(req: Request, res: Response): Promise<Response> {
//     try {
//       const { artistId } = req.params;
//       const subscriptions = await paymentService.getSubscriptionsByArtistId(Number(artistId));
//       return res.status(200).json(subscriptions);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }    
//   }

//   async getSubscriptionsByEstablishmentId(req: Request, res: Response): Promise<Response> {
//     try {
//       const { establishmentId } = req.params;
//       const subscriptions = await paymentService.getSubscriptionsByEstablishmentId(Number(establishmentId));
//       return res.status(200).json(subscriptions);
//     } catch (error) {
//       return res.status(400).json({ message: (error as Error).message });
//     }    
//   }
// }
