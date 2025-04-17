import { Router } from 'express';
import { EstablishmentController } from '../controllers/EstablishmentController';
import { authMiddleware, authenticateOwner } from '../middlewares/authMiddleware';

const establishmentController = new EstablishmentController();
const router = Router();

// ✅ Criar estabelecimento — apenas usuário autenticado
router.post('/establishments', authMiddleware, async (req, res, next) => {
  try {
    await establishmentController.create(req, res);
  } catch (error) {
    next(error);
  }
});

// ✅ Atualizar estabelecimento — só dono autenticado
router.put('/establishments/:id', authMiddleware, authenticateOwner, async (req, res, next) => {
  try {
    await establishmentController.update(req, res);
  } catch (error) {
    next(error);
  }
});

// ✅ Deletar estabelecimento — só dono autenticado
router.delete('/establishments/:id', authMiddleware, authenticateOwner, async (req, res, next) => {
  try {
    await establishmentController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

// 📥 Buscar estabelecimento por ID — público
router.get('/establishments/:id', async (req, res, next) => {
  try {
    await establishmentController.getById(req, res);
  } catch (error) {
    next(error);
  }
});

// 📋 Listar todos os estabelecimentos — público
router.get('/establishments', async (req, res, next) => {
  try {
    await establishmentController.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

// 🎤 Buscar artistas associados — público
router.get('/establishments/:id/artists', async (req, res, next) => {
  try {
    await establishmentController.getArtistsByEstablishment(req, res);
  } catch (error) {
    next(error);
  }
});

// ✅ Atualizar status de artista vinculado — só dono autenticado
router.patch(
  '/establishments/:establishmentId/artists/:artistId/status',
  authMiddleware,
  async (req, res, next) => {
    console.log(`🔍 ID do estabelecimento recebido:`, req.params.establishmentId);
    console.log(`🔍 ID do artista recebido:`, req.params.artistId);
    console.log(`🔍 Body recebido:`, req.body);

    try {
      await establishmentController.updateArtistStatus(req, res);
    } catch (error) {
      next(error);
    }
  }
);


export default router;
