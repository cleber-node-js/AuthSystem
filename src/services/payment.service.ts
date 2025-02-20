import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15', // Verifique se este valor está correto na sua configuração
});

export class PaymentService {
  async processPayment(data: {
    userId?: number;
    artistId?: number;
    establishmentId?: number;
    amount: number;
    receiptEmail: string;
  }) {
    // Criação do Payment Intent usando a API do Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: data.amount * 100, // O valor deve estar em centavos
      currency: 'usd',
      receipt_email: data.receiptEmail,
    });

    // Obtendo a URL do recibo de pagamento
    const receiptUrl = paymentIntent.charges && paymentIntent.charges.data.length > 0
      ? paymentIntent.charges.data[0].receipt_url
      : null; // Se não houver cobrança, será null

    // Criação da transação no banco de dados usando Prisma
    const transaction = await prisma.transaction.create({
      data: {
        userId: data.userId ?? null, // Converte undefined para null
        artistId: data.artistId ?? null,
        establishmentId: data.establishmentId ?? null,
        amount: data.amount,
        status: paymentIntent.status, // Status do Payment Intent do Stripe
        receiptUrl, // Atribuindo a URL do recibo corretamente
      },
    });

    return transaction; // Retorna a transação criada
  }

  async createSubscription(data: {
    userId?: number;
    artistId?: number;
    establishmentId?: number;
    plan: string;
    endDate: Date;
  }) {
    const subscription = await prisma.subscription.create({
      data: {
        userId: data.userId ?? null,
        artistId: data.artistId ?? null,
        establishmentId: data.establishmentId ?? null,
        plan: data.plan,
        status: 'active',
        endDate: data.endDate,
      },
    });

    return subscription;
  }

  async getTransactionsByUserId(userId: number) {
    return prisma.transaction.findMany({ where: { userId } });
  }

  async getTransactionsByArtistId(artistId: number) {
    return prisma.transaction.findMany({ where: { artistId } });
  }

  async getTransactionsByEstablishmentId(establishmentId: number) {
    return prisma.transaction.findMany({ where: { establishmentId } });
  }

  async getSubscriptionsByUserId(userId: number) {
    return prisma.subscription.findMany({ where: { userId } });
  }

  async getSubscriptionsByArtistId(artistId: number) {
    return prisma.subscription.findMany({ where: { artistId } });
  }

  async getSubscriptionsByEstablishmentId(establishmentId: number) {
    return prisma.subscription.findMany({ where: { establishmentId } });
  }
}