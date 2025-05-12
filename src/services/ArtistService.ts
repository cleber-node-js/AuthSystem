import { PrismaClient, Artist, ArtistStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class ArtistService {
  respondToShowRequest(requestToken: any, ownerId: number, arg2: string, approvalMessage: any): unknown {
    throw new Error('Method not implemented.');
  }
  constructor() { }

  async requestShow(artist_id: number, establishment_id: number): Promise<{ artist: Artist; requestToken: string }> {
    // 🔍 Verificar se o artista já solicitou apresentação neste estabelecimento
    const existingRequest = await prisma.establishmentArtists.findUnique({
      where: {
        artist_id_establishment_id: {
          artist_id,
          establishment_id,
        },
      },
    });

    if (existingRequest) {
      throw new Error(`Artista já solicitou apresentação neste estabelecimento.`);
    }

    // 🔍 Verificar se o artista e o estabelecimento existem
    const artist = await prisma.artist.findUnique({ where: { id: artist_id } });
    if (!artist) {
      throw new Error(`Artista com ID ${artist_id} não encontrado.`);
    }

    const establishment = await prisma.establishment.findUnique({ where: { id: establishment_id } });
    if (!establishment) {
      throw new Error(`Estabelecimento com ID ${establishment_id} não encontrado.`);
    }

    // ✅ Criar a relação artista-estabelecimento
    await prisma.establishmentArtists.create({
      data: {
        artist_id,
        establishment_id,
        status: ArtistStatus.PENDING,
        approvalMessage: null,
      },
    });

    // 🔑 Gerar token de solicitação
    const requestToken = jwt.sign(
      {
        artist_id,
        establishment_id,
      },
      "your_secret_key", // Altere para sua chave secreta
      { expiresIn: "7d" }
    );

    return { artist, requestToken };
  }

  /**
   * 🔹 Cria um novo artista e vincula ao estabelecimento.
   */
  async createArtist(
    name: string,
    genre: string = '',
    establishment_id: number,
    bio?: string,
    status: ArtistStatus = ArtistStatus.PENDING,
    imageUrl?: string // 👈 aceita URL da imagem
  ): Promise<{ artist: Artist; requestToken: string }> {
    console.log("🔍 Iniciando criação do artista...");

    const parsedEstablishment_id = Number(establishment_id);
    if (isNaN(parsedEstablishment_id)) {
      throw new Error('O ID do estabelecimento deve ser um número válido.');
    }

    const establishment = await prisma.establishment.findUnique({
      where: { id: parsedEstablishment_id },
    });

    if (!establishment) {
      throw new Error(`Estabelecimento com ID ${parsedEstablishment_id} não encontrado.`);
    }

    const artist = await prisma.artist.create({
      data: {
        name,
        genre,
        bio,
        imageUrl: imageUrl || "https://default-image-url.com/artist.jpg", // ✅ Nunca será null!
        status,
        establishments: {
          create: {
            establishment: { connect: { id: parsedEstablishment_id } },
            status,
          },
        },
      },
    });

    const requestToken = jwt.sign(
      { artist_id: artist.id, establishment_id: parsedEstablishment_id },
      "your_secret_key", // Altere para sua chave secreta
      { expiresIn: "7d" }
    );

    console.log(`✅ Artista criado com sucesso. Token gerado: ${requestToken}`);
    return { artist, requestToken };
  }

  /**
   * 🔹 Retorna todos os artistas cadastrados.
   */
  async getAllArtists(): Promise<Artist[]> {
    try {
      const artists = await prisma.artist.findMany({
        include: {
          establishments: true,
        },
      });
      return artists;
    } catch (error) {
      console.error("❌ Erro ao buscar todos os artistas:", error);
      throw new Error("Erro ao buscar artistas.");
    }
  }

  /**
   * 🔹 Buscar artista por ID.
   */
  async getArtistById(artist_id: number): Promise<Artist | null> {
    try {
      const artist = await prisma.artist.findUnique({
        where: { id: artist_id },
        include: { establishments: true },
      });
      return artist;
    } catch (error) {
      console.error(`❌ Erro ao buscar artista ID ${artist_id}:`, error);
      throw new Error("Erro ao buscar artista.");
    }
  }

  /**
   * 🔹 Atualizar informações de um artista.
   */
  async updateArtist(artist_id: number, data: Partial<Artist>): Promise<Artist> {
    try {
      const updatedArtist = await prisma.artist.update({
        where: { id: artist_id },
        data,
        include: { establishments: true },
      });
      return updatedArtist;
    } catch (error) {
      console.error(`❌ Erro ao atualizar artista ID ${artist_id}:`, error);
      throw new Error("Erro ao atualizar artista.");
    }
  }

  /**
   * 🔹 Soft delete de um artista (marca como inativo).
   */
  async deleteArtist(artist_id: number): Promise<Artist> {
    try {
      const deletedArtist = await prisma.artist.update({
        where: { id: artist_id },
        data: { status: ArtistStatus.ACTIVE },
      });
      return deletedArtist;
    } catch (error) {
      console.error(`❌ Erro ao excluir artista ID ${artist_id}:`, error);
      throw new Error("Erro ao excluir artista.");
    }
  }

  /**
   * 🔹 Buscar artistas por status.
   */
  async getArtistsByStatus(establishment_id: number, status: ArtistStatus): Promise<Artist[]> {
    try {
      const artists = await prisma.artist.findMany({
        where: {
          establishments: {
            some: { establishment_id },
          },
          status,
        },
        include: { establishments: true },
      });

      if (artists.length === 0) {
        throw new Error(`Nenhum artista encontrado com status ${status}.`);
      }

      return artists;
    } catch (error) {
      console.error("❌ Erro ao buscar artistas por status:", error);
      throw new Error("Erro ao buscar artistas por status.");
    }
  }

  /**
   * 🔹 Buscar artistas de um estabelecimento específico.
   */
  async getArtistsByEstablishment(establishment_id: number): Promise<Artist[]> {
    try {
      console.log(`🔍 Buscando artistas do estabelecimento ID: ${establishment_id}`);

      const artists = await prisma.artist.findMany({
        where: {
          establishments: {
            some: {
              establishment_id,
            },
          },
        },
        include: {
          establishments: true,
        },
      });

      if (artists.length === 0) {
        console.warn(`⚠️ Nenhum artista encontrado para o estabelecimento ID: ${establishment_id}`);
        throw new Error("Nenhum artista encontrado para este estabelecimento.");
      }

      console.log(`✅ Artistas encontrados: ${artists.length}`);
      return artists;
    } catch (error) {
      console.error("❌ Erro ao buscar artistas do estabelecimento:", error);
      throw new Error("Erro ao buscar artistas do estabelecimento.");
    }
  }
}