import { Request, Response } from 'express';
import { ArtistService } from '../services/ArtistService';

const artistService = new ArtistService();

export class ArtistController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, genre, bio, establishmentId } = req.body;
      const artist = await artistService.createArtist(name, establishmentId, genre, bio);
      
      console.log(`✅ Artista criado: ${JSON.stringify(artist, null, 2)}`);
      return res.status(201).json(artist);
    } catch (error) {
      console.error(`❌ Erro ao criar artista:`, error);
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao criar artista.' });
    }
  }

  async getArtist(req: Request, res: Response): Promise<Response> {
    const artistId = Number(req.params.id);
    if (isNaN(artistId)) {
      console.warn(`⚠️ ID do artista inválido: ${req.params.id}`);
      return res.status(400).json({ error: 'ID do artista inválido.' });
    }

    try {
      const artist = await artistService.getArtistById(artistId);
      if (!artist) {
        console.warn(`⚠️ Artista não encontrado para ID: ${artistId}`);
        return res.status(404).json({ error: 'Artista não encontrado.' });
      }

      console.log(`✅ Artista encontrado: ${JSON.stringify(artist, null, 2)}`);
      return res.status(200).json(artist);
    } catch (error) {
      console.error(`❌ Erro ao obter artista ID ${artistId}:`, error);
      return res.status(500).json({ error: 'Erro ao obter artista.' });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const artists = await artistService.getAllArtists();
      console.log(`✅ ${artists.length} artistas encontrados.`);
      return res.status(200).json(artists);
    } catch (error) {
      console.error(`❌ Erro ao obter artistas:`, error);
      return res.status(500).json({ error: 'Erro ao obter artistas.' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const artistId = Number(req.params.id);
    const data = req.body;
    if (isNaN(artistId)) {
      console.warn(`⚠️ ID do artista inválido para atualização: ${req.params.id}`);
      return res.status(400).json({ error: 'ID do artista inválido.' });
    }

    try {
      const updatedArtist = await artistService.updateArtist(artistId, data);
      console.log(`✅ Artista atualizado: ${JSON.stringify(updatedArtist, null, 2)}`);
      return res.status(200).json(updatedArtist);
    } catch (error) {
      console.error(`❌ Erro ao atualizar artista ID ${artistId}:`, error);
      return res.status(500).json({ error: 'Erro ao atualizar artista.' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const artistId = Number(req.params.id);
    if (isNaN(artistId)) {
      console.warn(`⚠️ ID do artista inválido para exclusão: ${req.params.id}`);
      return res.status(400).json({ error: 'ID do artista inválido.' });
    }

    try {
      const deletedArtist = await artistService.deleteArtist(artistId);
      console.log(`✅ Artista excluído: ${JSON.stringify(deletedArtist, null, 2)}`);
      return res.status(200).json({ message: 'Artista excluído com sucesso.', artist: deletedArtist });
    } catch (error) {
      console.error(`❌ Erro ao excluir artista ID ${artistId}:`, error);
      return res.status(500).json({ error: 'Erro ao excluir artista.' });
    }
  }
}