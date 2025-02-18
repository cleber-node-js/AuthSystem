// routes/establishment.routes.ts
import { Router } from 'express';
import { EstablishmentController } from '../controllers/EstablishmentController';

const establishmentController = new EstablishmentController();
const router = Router();

// Rota para criar um novo estabelecimento
router.post('/establishments', establishmentController.create);

// Rota para obter um estabelecimento pelo ID
router.get('/establishments/:id', establishmentController.getById);

// Rota para obter todos os estabelecimentos
router.get('/establishments', establishmentController.getAll);

// Rota para atualizar um estabelecimento
router.put('/establishments/:id', establishmentController.update);

// Rota para deletar um estabelecimento
router.delete('/establishments/:id', establishmentController.delete);

export default router;