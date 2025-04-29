import { PrismaClient, Artist, ArtistStatus } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class ArtistService {
  respondToShowRequest(requestToken: any, ownerId: number, arg2: string, approvalMessage: any): unknown {
    throw new Error('Method not implemented.');
  }
  constructor() {}

  async requestShow(artistId: number, establishmentId: number): Promise<{ artist: Artist; requestToken: string }> {
    // 🔍 Verificar se o artista já solicitou apresentação neste estabelecimento
    const existingRequest = await prisma.establishmentArtists.findUnique({
      where: {
        artistId_establishmentId: {
          artistId,
          establishmentId,
        },
      },
    });

    if (existingRequest) {
      throw new Error(`Artista já solicitou apresentação neste estabelecimento.`);
    }

    // 🔍 Verificar se o artista e o estabelecimento existem
    const artist = await prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) {
      throw new Error(`Artista com ID ${artistId} não encontrado.`);
    }

    const establishment = await prisma.establishment.findUnique({ where: { id: establishmentId } });
    if (!establishment) {
      throw new Error(`Estabelecimento com ID ${establishmentId} não encontrado.`);
    }

    // ✅ Criar a relação artista-estabelecimento
    await prisma.establishmentArtists.create({
      data: {
        artistId,
        establishmentId,
        status: ArtistStatus.PENDING,
        approvalMessage: null,
      },
    });

    // 🔑 Gerar token de solicitação
    const requestToken = jwt.sign(
      { artistId, establishmentId },
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
    establishmentId: number,
    bio?: string,
    status: ArtistStatus = ArtistStatus.PENDING,
    imageUrl?: string // 👈 aceita URL da imagem
  ): Promise<{ artist: Artist; requestToken: string }> {
    console.log("🔍 Iniciando criação do artista...");

    const parsedEstablishmentId = Number(establishmentId);
    if (isNaN(parsedEstablishmentId)) {
      throw new Error('O ID do estabelecimento deve ser um número válido.');
    }

    const establishment = await prisma.establishment.findUnique({
      where: { id: parsedEstablishmentId },
    });

    if (!establishment) {
      throw new Error(`Estabelecimento com ID ${parsedEstablishmentId} não encontrado.`);
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
            establishment: { connect: { id: parsedEstablishmentId } },
            status,
          },
        },
      },
    });

    const requestToken = jwt.sign(
      { artistId: artist.id, establishmentId: parsedEstablishmentId },
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
  async getArtistById(artistId: number): Promise<Artist | null> {
    try {
      const artist = await prisma.artist.findUnique({
        where: { id: artistId },
        include: { establishments: true },
      });
      return artist;
    } catch (error) {
      console.error(`❌ Erro ao buscar artista ID ${artistId}:`, error);
      throw new Error("Erro ao buscar artista.");
    }
  }

  /**
   * 🔹 Atualizar informações de um artista.
   */
  async updateArtist(artistId: number, data: Partial<Artist>): Promise<Artist> {
    try {
      const updatedArtist = await prisma.artist.update({
        where: { id: artistId },
        data,
        include: { establishments: true },
      });
      return updatedArtist;
    } catch (error) {
      console.error(`❌ Erro ao atualizar artista ID ${artistId}:`, error);
      throw new Error("Erro ao atualizar artista.");
    }
  }

  /**
   * 🔹 Soft delete de um artista (marca como inativo).
   */
  async deleteArtist(artistId: number): Promise<Artist> {
    try {
      const deletedArtist = await prisma.artist.update({
        where: { id: artistId },
        data: { status: ArtistStatus.ACTIVE },
      });
      return deletedArtist;
    } catch (error) {
      console.error(`❌ Erro ao excluir artista ID ${artistId}:`, error);
      throw new Error("Erro ao excluir artista.");
    }
  }

  /**
   * 🔹 Buscar artistas por status.
   */
  async getArtistsByStatus(establishmentId: number, status: ArtistStatus): Promise<Artist[]> {
    try {
      const artists = await prisma.artist.findMany({
        where: {
          establishments: {
            some: { establishmentId },
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
  async getArtistsByEstablishment(establishmentId: number): Promise<Artist[]> {
    try {
      console.log(`🔍 Buscando artistas do estabelecimento ID: ${establishmentId}`);

      const artists = await prisma.artist.findMany({
        where: {
          establishments: {
            some: {
              establishmentId,
            },
          },
        },
        include: {
          establishments: true,
        },
      });

      if (artists.length === 0) {
        console.warn(`⚠️ Nenhum artista encontrado para o estabelecimento ID: ${establishmentId}`);
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