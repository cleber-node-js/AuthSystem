import express from 'express';
import { ArtistController } from '../controllers/ArtistController';
import { upload } from '../middlewares/upload';
import { CustomRequest } from '../@types/CustomRequest';
import { authMiddleware as authenticateToken, authenticateOwner } from '../middlewares/authMiddleware';

const router = express.Router();
const artistController = new ArtistController();

// 🔹 Criar um novo artista com upload de imagem
router.post('/artists', authenticateToken, upload.single('image'), async (req, res) => {
  await artistController.create(req as CustomRequest, res);
});

// 🔹 Obter um artista pelo ID
router.get('/artists/:id', authenticateToken, async (req, res) => {
  await artistController.getArtist(req as CustomRequest, res);
});

// 🔹 Obter todos os artistas
router.get('/artists', authenticateToken, async (req, res) => {
  await artistController.getAll(req as CustomRequest, res);
});

// 🔹 Atualizar um artista
router.put('/artists/:id', authenticateToken, async (req, res) => {
  await artistController.update(req as CustomRequest, res);
});

// 🔹 Excluir um artista
router.delete('/artists/:id', authenticateToken, async (req, res) => {
  await artistController.delete(req as CustomRequest, res);
});

// 🔹 Solicitar apresentação (artista solicita ao estabelecimento)
router.post('/artists/request-show', authenticateToken, async (req, res) => {
  await artistController.requestShow(req as CustomRequest, res);
});

// 🔹 Aprovar apresentação (atalho simples, se desejar apenas aprovar rapidamente)
router.post('/artists/approve-show', authenticateToken, async (req, res) => {
  await artistController.approveShow(req as CustomRequest, res);
});

// 🔹 Aprovar ou rejeitar apresentação com mensagem personalizada (somente dono do estabelecimento)
router.post('/artists/respond', authenticateToken, authenticateOwner, async (req, res) => {
  await artistController.respondToShowRequest(req as CustomRequest, res);
});

// 🔹 Obter artistas vinculados a um estabelecimento específico
router.get('/artists/by-establishment/:establishmentId', authenticateToken, async (req, res) => {
  await artistController.getArtistsByEstablishment(req as CustomRequest, res);
});

// 🔹 Obter artistas de um estabelecimento filtrados por status (PENDING, APPROVED, REJECTED)
router.get('/artists/by-status/:establishmentId', authenticateToken, async (req, res) => {
  await artistController.getArtistsByStatus(req as CustomRequest, res);
});

export default router;
