import { PrismaClient, Artist } from '@prisma/client';

const prisma = new PrismaClient();

export class ArtistService {
  async createArtist(name: string, establishmentId: number, genre: string = '', bio?: string): Promise<Artist> {
    // Verificar se o estabelecimento existe e usar o ID correto
    const establishment = await prisma.establishment.findUnique({
      where: { id: establishmentId }
    });

    if (!establishment) {
      throw new Error(`Estabelecimento com ID ${establishmentId} não encontrado.`);
    }

    // Criar o artista
    const artist = await prisma.artist.create({
      data: {
        name,
        genre,
        bio,
        establishmentId,
      },
    });

    return artist;
  }

  async getArtistById(artistId: number): Promise<Artist | null> {
    return await prisma.artist.findUnique({
      where: { id: artistId },
      include: { establishment: true },
    });
  }

  async getAllArtists(): Promise<Artist[]> {
    return await prisma.artist.findMany({
      include: { establishment: true },
    });
  }

  async updateArtist(artistId: number, data: Partial<Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Artist> {
    return await prisma.artist.update({
      where: { id: artistId },
      data,
    });
  }

  async deleteArtist(artistId: number): Promise<Artist> {
    return await prisma.artist.delete({
      where: { id: artistId },
    });
  }
}
