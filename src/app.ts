import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sessionRoutes from './routes/sessionRoutes';
import userRoutes from './routes/userRoutes';
import artistRoutes from './routes/artistRoutes';
import establishmentRoutes from './routes/establishment.routes';
import eventRoutes from './routes/eventRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import classificationRoutes from './routes/classificationRoutes';
import ratingRoutes from './routes/ratingRoutes';
import userRoleRoutes from './routes/userRoleRoutes';
import { authRoutes } from './routes/authRoutes';
import userPreferenceRoutes from './routes/userPreference.routes';
import userVerificationTokenRoutes from './routes/userVerificationTokenRoutes';
import notificationRoutes from './routes/notification.routes';
//import paymentRoutes from './routes/payment.routes';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Prefixando rotas (sem authMiddleware aqui)
app.use('/api', userRoutes); 
app.use('/api', artistRoutes);
app.use('/api', establishmentRoutes);

// Rotas que não precisam de autenticação
app.use('/auth', authRoutes); // Rotas de autenticação (register, login)

//Rotas que não pertencem ao api
app.use('/sessions', sessionRoutes);
app.use('/events', eventRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/classifications', classificationRoutes);
app.use('/ratings', ratingRoutes);
app.use('/user-roles', userRoleRoutes);
app.use('/api', userPreferenceRoutes);
app.use('/api', userVerificationTokenRoutes);
app.use('/api', notificationRoutes);
//app.use('/api', paymentRoutes);

app.get('/', (_req, res) => {
    res.send('API rodando no subdomínio api.bizzinpro.com.br!');
  });
// Tratamento de erros
const errorHandler: ErrorRequestHandler = (err, _req: Request, res: Response, _next: NextFunction) => {
    console.error('❌ Erro:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
};

app.use(errorHandler);

export { app };