import { Request, Response } from 'express';
import { EstablishmentService } from '../services/EstablishmentService';
import { CustomRequest } from '../middlewares/authMiddleware';
import fs from 'fs';
import sharp from 'sharp';
import cloudinary from '../utils/cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { resolve } from 'path';
import { arrayBuffer } from 'stream/consumers';
import { error } from 'console';

const establishmentService = new EstablishmentService();

export class EstablishmentController {
  // ✅ Criar estabelecimento com imagem e novos campos
  async create(req: CustomRequest, res: Response): Promise<Response> {
    const { name, address, contact, latitude, longitude, categories } = req.body;
    const primaryOwner_id = req.user_id;
    const imageFile = req.file;

    console.log("Estou recebendo primaryOwner", primaryOwner_id)

    if (!primaryOwner_id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    let parsedCategories = Array.isArray(categories)
      ? categories
      : typeof categories === 'string'
        ? (() => {
          try {
            return JSON.parse(categories);
          } catch (error) {
            console.error('Erro ao fazer parse da categorias estabelecimento', error);
            return [];
          }
        })() : [];

    if (
      !name ||
      !address ||
      !contact ||
      !latitude ||
      !longitude ||
      !parsedCategories.length
    ) {
      return res.status(400).json({
        error: 'Nome, endereço, contato, latitude, longitude, categorias são obrigatórios.',
      });
    }


    if (!imageFile) {
      return res.status(400).json({ error: 'Imagem obrigatória.' });
    }


    const existingEstablishment = await establishmentService.getEstablishmentByOwnerId(Number(primaryOwner_id))

    if (existingEstablishment && existingEstablishment.imageUrl) {
      return res.status(400).json({
        error: "Já existe uma imagem cadastrada para este estabelecimento."
      })
    }

    console.log("Exist estabelecimento", existingEstablishment)

    try {
      const buffer = await fs.promises.readFile(imageFile.path)
      const compressedBuffer = await sharp(buffer)
        .resize(800, 800, { fit: 'inside' })
        .webp({ quality: 80 })
        .toBuffer();

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'establishments', },
          function (error, result) {
            if (error) {
              console.error('Erro ao fazer upload para o Cloudinary:', error);
              return reject(error);
            }
            if (!result) {
              return reject(new Error('Erro ao fazer upload da image.'))
            }
            resolve(result)
          }
        ).end(compressedBuffer);
      })

      const imageUrl = result.secure_url;

      const establishment = await establishmentService.createEstablishment(
        name,
        address,
        contact,
        Number(primaryOwner_id),
        parseFloat(latitude),
        parseFloat(longitude),
        parsedCategories,
        imageUrl
      );

      return res.status(201).json(establishment);
    } catch (error) {
      console.error("❌ Erro ao criar estabelecimento:", error);
      return res.status(500).json({ error: "Erro ao criar estabelecimento." });
    }
  }

  // 🔍 Obter estabelecimento por ID
  async getById(req: Request, res: Response): Promise<Response> {
    const establishment_id = parseInt(req.params.id, 10);

    if (isNaN(establishment_id) || establishment_id <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishment_id);
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
    const establishment_id = parseInt(req.params.id, 10);
    const { status } = req.query;

    if (isNaN(establishment_id) || establishment_id <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const artists = await establishmentService.getArtistsByEstablishmentAndStatus(
        establishment_id,
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
    const establishment_id = parseInt(req.params.id, 10);
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (isNaN(establishment_id) || establishment_id <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishment_id);
      console.log("🛡️ Estabelecimento encontrado:", establishment);

      if (establishment.primaryOwner_id !== Number(user_id)) {
        return res.status(403).json({ error: 'Você não tem permissão para atualizar este estabelecimento.' });
      }

      const { name, address, contact } = req.body;
      const imageFile = req.file;
      const updatedData: Record<string, any> = {};

      if (name) updatedData.name = name;
      if (address) updatedData.address = address;
      if (contact) updatedData.contact = contact;

      if (imageFile) {
        const arrayBuffer = await fs.promises.readFile(imageFile.path)
        const buffer = new Uint8Array(arrayBuffer);
        const compressedBuffer = await sharp(buffer)
          .resize(800, 800, { fit: 'inside' })
          .webp({ quality: 80 })
          .toBuffer();

        const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'establishments', },
            function (error, result) {
              if (error) {
                console.error('Erro ao fazer upload para o Cloudinary:', error);
                return reject(error);
              } if (result) return resolve(result);
              reject(new Error('Erro ao fazer upload da imagem.'));
            }
          ).end(compressedBuffer);
        })

        if (establishment.imageUrl) {
          const public_idMatch = establishment.imageUrl.match(/\/upload\/v\d+\/establishments\/(.+)\.webp/);
          const public_id = public_idMatch ? public_idMatch[1] : null;

          if (public_id) {
            await cloudinary.uploader.destroy(`establishments/${public_id}`);
            console.log('🧹 Imagem antiga deletada:', public_id);
          } else {
            console.warn('⚠️ ID público não encontrado na URL da imagem:', establishment.imageUrl);
          }
        }

        updatedData.imageUrl = uploadResult.secure_url;

      }

      const updatedEstableshment = await establishmentService.updateEstablishment(establishment_id, updatedData);
      return res.status(200).json(updatedEstableshment);
    } catch (error) {
      console.error('❌ Erro ao atualizar estabelecimento:', error);
      return res.status(500).json({ error: (error instanceof Error ? error.message : 'Erro desconhecido') });
    }
  }

  // 🗑️ Excluir estabelecimento
  async delete(req: CustomRequest, res: Response): Promise<Response> {
    const establishment_id = parseInt(req.params.id, 10);
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (isNaN(establishment_id) || establishment_id <= 0) {
      return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishment_id);
      console.log("🛡️ Estabelecimento encontrado:", establishment);

      if (establishment.primaryOwner_id !== Number(user_id)) {
        return res.status(403).json({ error: 'Você não tem permissão para excluir este estabelecimento.' });
      }

      if (establishment.imageUrl) {
        const match = establishment.imageUrl.match(/\/upload\/v\d+\/establishments\/(.+)\.webp/);
        const public_id = match ? match[1] : null;

        if (public_id) {
          await cloudinary.uploader.destroy(`establishments/${public_id}`);
          console.log('🧹 Imagem excluída do Cloudinary:', public_id);
        } else {
          console.warn('⚠️ ID público não encontrado na URL da imagem:', establishment.imageUrl);
        }
      }

      const result = await establishmentService.deleteEstablishment(establishment_id);
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

    const establishment_id = parseInt(req.params.establishment_id, 10) || parseInt(req.body.establishment_id, 10);
    const artistId = parseInt(req.params.artistId, 10) || parseInt(req.body.artistId, 10);
    const { status } = req.body;
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (isNaN(establishment_id) || isNaN(artistId)) {
      return res.status(400).json({ error: "ID do estabelecimento ou do artista inválido." });
    }

    if (!["APPROVED", "REJECTED", "PENDING", "DECLINED", "REFUNDED"].includes(status?.toUpperCase())) {
      return res.status(400).json({ error: "Status inválido. Use APPROVED, REJECTED, PENDING, DECLINED ou REFUNDED." });
    }

    try {
      const establishment = await establishmentService.getEstablishmentById(establishment_id);
      if (!establishment) {
        return res.status(404).json({ error: "Estabelecimento não encontrado." });
      }

      if (establishment.primaryOwner_id !== Number(user_id)) {
        return res.status(403).json({ error: "Você não tem permissão para alterar artistas neste estabelecimento." });
      }

      const result = await establishmentService.updateArtistStatus(
        establishment_id,
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