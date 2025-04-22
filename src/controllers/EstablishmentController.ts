import { Request, Response } from 'express';
import { EstablishmentService } from '../services/EstablishmentService';
import { CustomRequest } from '../middlewares/authMiddleware';

const establishmentService = new EstablishmentService();

export class EstablishmentController {
  // ✅ Criar estabelecimento com imagem
async create(req: CustomRequest, res: Response): Promise<Response> {
  const { name, address, contact } = req.body;
  const primaryOwnerId = req.userId;

  // Verificar se o usuário está autenticado
  if (!primaryOwnerId) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  // Definir a URL da imagem, se fornecida
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const establishment = await establishmentService.createEstablishment(
      name,
      address,
      contact,
      Number(primaryOwnerId),
      imageUrl // ✅ Enviado ao service
    );
    return res.status(201).json(establishment);
  } catch (error) {
    console.error('❌ Erro ao criar estabelecimento:', error);
    return res.status(500).json({ error: 'Erro ao criar estabelecimento.' });
  }
 }

  // 🔍 Obter estabelecimento por ID
  async getById(req: Request, res: Response): Promise<Response> {
    const establishmentId = parseInt(req.params.id, 10);

    if (isNaN(establishmentId) || establishmentId <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishmentId);
      return res.status(200).json(establishment);
    } catch (error) {
      console.error('❌ Erro ao buscar estabelecimento:', error);
      return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
    }
  }

  // 🔍 Obter todos os estabelecimentos
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const establishments = await establishmentService.getAllEstablishments();
      return res.status(200).json(establishments);
    } catch (error) {
      console.error('❌ Erro ao listar estabelecimentos:', error);
      return res.status(500).json({ error: 'Erro ao listar estabelecimentos.' });
    }
  }

  // 🔍 Obter artistas por estabelecimento e status
  async getArtistsByEstablishment(req: Request, res: Response): Promise<Response> {
    const establishmentId = parseInt(req.params.id, 10);
    const { status } = req.query;

    if (isNaN(establishmentId) || establishmentId <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const artists = await establishmentService.getArtistsByEstablishmentAndStatus(
        establishmentId,
        status?.toString()
      );
      return res.status(200).json(artists);
    } catch (error) {
      console.error('❌ Erro ao obter artistas:', error);
      return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
    }
  }

  // ✏️ Atualizar estabelecimento
  async update(req: CustomRequest, res: Response): Promise<Response> {
    const establishmentId = parseInt(req.params.id, 10);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (isNaN(establishmentId) || establishmentId <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishmentId);
      if (establishment.primaryOwnerId !== Number(userId)) {
        return res.status(403).json({ error: 'Você não tem permissão para atualizar este estabelecimento.' });
      }

      const updated = await establishmentService.updateEstablishment(establishmentId, req.body);
      return res.status(200).json(updated);
    } catch (error) {
      console.error('❌ Erro ao atualizar estabelecimento:', error);
      return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
    }
  }

  // 🗑️ Excluir estabelecimento
  async delete(req: CustomRequest, res: Response): Promise<Response> {
    const establishmentId = parseInt(req.params.id, 10);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (isNaN(establishmentId) || establishmentId <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishmentId);
      if (establishment.primaryOwnerId !== Number(userId)) {
        return res.status(403).json({ error: 'Você não tem permissão para excluir este estabelecimento.' });
      }

      const result = await establishmentService.deleteEstablishment(establishmentId);
      return res.status(200).json(result);
    } catch (error) {
      console.error('❌ Erro ao excluir estabelecimento:', error);
      return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
    }
  }

  // ✅ Atualizar status do artista (APPROVED / REJECTED / PENDING / DECLINED / REFUNDED)
  async updateArtistStatus(req: CustomRequest, res: Response): Promise<Response> {
    console.log("🔍 Params recebidos:", req.params);
    console.log("🔍 Body recebido:", req.body);

    const establishmentId = parseInt(req.params.establishmentId, 10) || parseInt(req.body.establishmentId, 10);
    const artistId = parseInt(req.params.artistId, 10) || parseInt(req.body.artistId, 10);
    const { status } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (isNaN(establishmentId) || isNaN(artistId)) {
      return res.status(400).json({ error: "ID do estabelecimento ou do artista inválido." });
    }

    if (!["APPROVED", "REJECTED", "PENDING", "DECLINED", "REFUNDED"].includes(status?.toUpperCase())) {
      return res.status(400).json({ error: "Status inválido. Use APPROVED, REJECTED, PENDING, DECLINED ou REFUNDED." });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishmentId);
      if (!establishment) {
        return res.status(404).json({ error: "Estabelecimento não encontrado." });
      }

      if (establishment.primaryOwnerId !== Number(userId)) {
        return res.status(403).json({ error: "Você não tem permissão para alterar artistas neste estabelecimento." });
      }

      const result = await establishmentService.updateArtistStatus(
        establishmentId,
        artistId,
        status.toUpperCase()
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ Erro ao atualizar status do artista:", error);
      return res.status(500).json({ error: (error instanceof Error ? error.message : "Erro desconhecido") });
    }
  }
}
