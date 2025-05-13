import { PrismaClient, Establishment, ArtistStatus } from '@prisma/client';

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
    primaryOwner_id: number,
    latitude: number,
    longitude: number,
    categories: string,
    imageUrl?: string // <-- novo parâmetro opcional
  ): Promise<Establishment> {
    if (!name || !primaryOwner_id || !latitude || !longitude || categories.length === 0) {
      throw new Error("Nome, ID do proprietário, localização e categorias são obrigatórios.");
    }

    const categoryNames = categories.split(',').map(c => c.trim());
    const categoryEntities = await prisma.category.findMany({
      where: {
        name: {
          in: categoryNames
        }
      }
    })


    return prisma.establishment.create({
      data: {
        name,
        address,
        contact,
        latitude,
        longitude,
        primaryOwner_id,
        imageUrl,
        categories: {
          create: categoryEntities.map(cat => ({
            category: {
              connect: { id: cat.id }
            }
          }))
        },
      },
      include: {
        categories: true,
      }
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

  async getEstablishmentByOwnerId(primaryOwner_id: number): Promise<Establishment | null> {
    if (!Number.isInteger(primaryOwner_id) || primaryOwner_id <= 0) {
      throw new Error(`ID do proprietario inválido: ${primaryOwner_id}`);
    }

    return prisma.establishment.findFirst({
      where: {
        primaryOwner_id: primaryOwner_id
      },
      include: {
        categories: true
      }
    })
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
  async getArtistsByEstablishmentAndStatus(establishment_id: number, status?: string): Promise<any[]> {
    if (!Number.isInteger(establishment_id) || establishment_id <= 0) {
      throw new Error('ID do estabelecimento inválido.');
    }

    const whereClause: any = {
      establishments: {
        some: {
          establishment_id,
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
      primaryOwner_id: number;
      latitude: number;
      longitude: number;
      categories: string
    }>
  ): Promise<Establishment> {
    await this.getEstablishmentById(id); // Valida existência

    return prisma.establishment.update({
      where: { id },
      data: {
        ...data,
        categories: data.categories ? {
          deleteMany: {}, // Exclui todas as categorias existentes
          create: data.categories.split(',').map(category => ({
            category: { connect: { name: category.trim() } }
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
      where: { id: id },
    });

    await prisma.establishmentCategory.deleteMany({
      where: { establishment_id: id },
    });

    return { message: `Estabelecimento com ID ${id} foi excluído com sucesso.` };
  }

  // 🎤 Atualizar o status de um artista no relacionamento com o estabelecimento
  async updateArtistStatus(
    establishment_id: number,
    artist_id: number,
    status: ArtistStatus
  ): Promise<{ message: string }> {
    if (!Number.isInteger(establishment_id) || establishment_id <= 0 ||
      !Number.isInteger(artist_id) || artist_id <= 0) {
      throw new Error('IDs do estabelecimento ou do artista inválidos.');
    }

    const relation = await prisma.establishmentArtists.findFirst({
      where: {
        artist_id,
        establishment_id,
      },
    });

    if (!relation) {
      throw new NotFoundError(`Artista com ID ${artist_id} não está vinculado ao estabelecimento ${establishment_id}.`);
    }

    await prisma.establishmentArtists.update({
      where: {
        artist_id_establishment_id: {
          artist_id,
          establishment_id,
        },
      },
      data: { status },
    });

    return { message: `Status do artista com ID ${artist_id} no estabelecimento ${establishment_id} atualizado para ${status}.` };
  }
}