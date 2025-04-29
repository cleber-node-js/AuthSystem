import { PrismaClient, Establishment, ArtistStatus, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class EstablishmentService {
  // ✅ Criar estabelecimento com imagem, localização e categorias
  async createEstablishment(
    name: string,
    address: string | null,
    contact: string | null,
    primaryOwnerId: number,
    latitude: number,
    longitude: number,
    categories: CategoryType[],
    imageUrl?: string // <-- novo parâmetro opcional
  ): Promise<Establishment> {
    if (!name || !primaryOwnerId || !latitude || !longitude || categories.length === 0) {
      throw new Error("Nome, ID do proprietário, localização e categorias são obrigatórios.");
    }

    return prisma.establishment.create({
      data: {
        name,
        address,
        contact,
        latitude,
        longitude,
        primaryOwnerId,
        imageUrl,
        categories: {
          create: categories.map(category => ({
            category
          })),
        },
      },
    });
  }

  // 🔍 Buscar estabelecimento por ID
  async getEstablishmentById(id: number): Promise<Establishment> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error(`ID do estabelecimento inválido: ${id}`);
    }

    const establishment = await prisma.establishment.findUnique({
      where: { id },
      include: {
        categories: true, // Incluindo categorias ao buscar o estabelecimento
      }
    });

    if (!establishment) {
      throw new NotFoundError(`Estabelecimento com ID ${id} não encontrado.`);
    }

    return establishment;
  }

  // 🔍 Buscar todos os estabelecimentos
  async getAllEstablishments(): Promise<Establishment[]> {
    return prisma.establishment.findMany({
      include: {
        categories: true, // Incluindo categorias ao listar estabelecimentos
      }
    });
  }

  // 🔎 Buscar artistas por estabelecimento e status
  async getArtistsByEstablishmentAndStatus(establishmentId: number, status?: string): Promise<any[]> {
    if (!Number.isInteger(establishmentId) || establishmentId <= 0) {
      throw new Error('ID do estabelecimento inválido.');
    }

    const whereClause: any = {
      establishments: {
        some: {
          establishmentId,
        },
      },
    };

    if (status) {
      const normalizedStatus = status.toUpperCase().trim() as ArtistStatus;
      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(normalizedStatus)) {
        throw new Error('Status inválido. Use PENDING, APPROVED ou REJECTED.');
      }

      whereClause.establishments.some.status = normalizedStatus;
    }

    return prisma.artist.findMany({
      where: whereClause,
      include: { establishments: true },
    });
  }

  // ✏️ Atualizar um estabelecimento
  async updateEstablishment(
    id: number,
    data: Partial<{ 
      name: string; 
      address: string; 
      contact: string; 
      primaryOwnerId: number; 
      latitude: number; 
      longitude: number; 
      categories: CategoryType[] 
    }>
  ): Promise<Establishment> {
    await this.getEstablishmentById(id); // Valida existência

    return prisma.establishment.update({
      where: { id },
      data: {
        ...data,
        categories: data.categories ? {
          deleteMany: {}, // Exclui todas as categorias existentes
          create: data.categories.map(category => ({
            category
          })), // Adiciona novas categorias
        } : undefined,
      },
      include: {
        categories: true, // Inclui categorias no resultado após a atualização
      }
    });
  }

  // 🗑️ Excluir um estabelecimento
  async deleteEstablishment(id: number): Promise<{ message: string }> {
    await this.getEstablishmentById(id); // Valida existência

    await prisma.establishment.delete({
      where: { id },
    });

    return { message: `Estabelecimento com ID ${id} foi excluído com sucesso.` };
  }

  // 🎤 Atualizar o status de um artista no relacionamento com o estabelecimento
  async updateArtistStatus(
    establishmentId: number,
    artistId: number,
    status: ArtistStatus
  ): Promise<{ message: string }> {
    if (!Number.isInteger(establishmentId) || establishmentId <= 0 ||
        !Number.isInteger(artistId) || artistId <= 0) {
      throw new Error('IDs do estabelecimento ou do artista inválidos.');
    }

    const relation = await prisma.establishmentArtists.findFirst({
      where: {
        artistId,
        establishmentId,
      },
    });

    if (!relation) {
      throw new NotFoundError(`Artista com ID ${artistId} não está vinculado ao estabelecimento ${establishmentId}.`);
    }

    await prisma.establishmentArtists.update({
      where: {
        artistId_establishmentId: {
          artistId,
          establishmentId,
        },
      },
      data: { status },
    });

    return { message: `Status do artista com ID ${artistId} no estabelecimento ${establishmentId} atualizado para ${status}.` };
  }
}