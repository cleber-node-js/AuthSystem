import { Request, Response } from 'express';
import { EstablishmentService } from '../services/EstablishmentService';
import { CustomRequest } from '../middlewares/authMiddleware';
import fs from 'fs';
import sharp from 'sharp';
import cloudinary from '../utils/cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { resolve } from 'path';
import { CategoryType } from '@prisma/client';
import { arrayBuffer } from 'stream/consumers';

const establishmentService = new EstablishmentService();

export class EstablishmentController {
  // ✅ Criar estabelecimento com imagem e novos campos
  async create(req: CustomRequest, res: Response): Promise<Response> {
    const { name, address, contact, latitude, longitude, categories, imageUrl } = req.body;
    const primaryOwnerId = req.userId;
    const imageFile = req.file;

    let parsedCategories: CategoryType[] = [];
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (error) {
        console.error('Erro ao fazer parse das categorias:', error);
        parsedCategories = [];
      }
    }


    if (!primaryOwnerId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (
      !name ||
      !address ||
      !contact ||
      !latitude ||
      !longitude ||
      !parsedCategories.length ||
      !primaryOwnerId
    ) {
      return res.status(400).json({
        error: 'Nome, endereço, contato, latitude, longitude, categorias e ID do proprietário são obrigatórios.',
      });
    }


    if (!imageFile) {
      return res.status(400).json({ error: 'Imagem obrigatória.' });
    }

    try {
      const arrayBuffer = await fs.promises.readFile(imageFile.path)
      const buffer = new Uint8Array(arrayBuffer);
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
              reject(error);
            } else {
              if (result) {
                resolve(result);
              }
              reject(new Error('Erro ao fazer upload da imagem.'));
            }
          }
        ).end(compressedBuffer);
      })

      const imageUrl = result.secure_url;

      const establishment = await establishmentService.createEstablishment(
        name,
        address,
        contact,
        Number(primaryOwnerId),
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
      console.log("🛡️ Estabelecimento encontrado:", establishment);

      if (establishment.primaryOwnerId !== Number(userId)) {
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
          const publicIdMatch = establishment.imageUrl.match(/\/upload\/v\d+\/establishments\/(.+)\.webp/);
          const publicId = publicIdMatch ? publicIdMatch[1] : null;

          if (publicId) {
            await cloudinary.uploader.destroy(`establishments/${publicId}`);
            console.log('🧹 Imagem antiga deletada:', publicId);
          } else {
            console.warn('⚠️ ID público não encontrado na URL da imagem:', establishment.imageUrl);
          }
        }

        updatedData.imageUrl = uploadResult.secure_url;

      }

      const updatedEstableshment = await establishmentService.updateEstablishment(establishmentId, updatedData);
      return res.status(200).json(updatedEstableshment);
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
      console.log("🛡️ Estabelecimento encontrado:", establishment);

      if (establishment.primaryOwnerId !== Number(userId)) {
        return res.status(403).json({ error: 'Você não tem permissão para excluir este estabelecimento.' });
      }

      if(establishment.imageUrl) {
        const match = establishment.imageUrl.match(/\/upload\/v\d+\/establishments\/(.+)\.webp/);
        const publicId = match ? match[1] : null;

        if(publicId) {
          await cloudinary.uploader.destroy(`establishments/${publicId}`);
          console.log('🧹 Imagem excluída do Cloudinary:', publicId);
        } else {
          console.warn('⚠️ ID público não encontrado na URL da imagem:', establishment.imageUrl);
        }
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