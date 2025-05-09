import { PrismaClient, Event, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

export class EventService {

  // Criar um novo evento
  async createEvent(eventData: {
    name: string;
    description?: string;
    imageUrl?: string;
    startDate: Date;
    endDate?: Date;
    latitude: number;
    longitude: number;
    establishmentId: number;
    categories: string[];
    artists: number[];
  }): Promise<Event> {
    return prisma.event.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        imageUrl: eventData.imageUrl || "https://default-image-url.com/image.jpg", // ✅ Corrigido!
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        establishmentId: eventData.establishmentId,
        categories: {
          create: eventData.categories.map(category => ({ category: category.toUpperCase() as CategoryType }))
        },
        artists: {
          connect: eventData.artists.map(artistId => ({ id: artistId }))
        }
      }
    });
  }

  // Obter todos os eventos
  async getAllEvents(): Promise<Event[]> {
    return prisma.event.findMany({
      include: {
        categories: true
      }
    });
  }

  async getAllEventsGroupedByEstablishment(): Promise<any[]> {
    const events = await prisma.event.findMany({
      include: {
        categories: {
          select: {
            category: true,
          },
        },
        artists: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const grouped: Record<number, any[]> = {};

    // Agrupa os eventos por establishmentId
    for (const event of events) {
      const establishmentId = event.establishmentId;

      if (!grouped[establishmentId]) {
        grouped[establishmentId] = [];
      }

      grouped[establishmentId].push(event);
    }

    // Transforma o objeto em array organizado
    return Object.entries(grouped).map(([establishmentId, events]) => ({
      establishmentId: Number(establishmentId),
      events,
    }));
  }

  async getAllEventsByUserId(userId: number) {
    return await prisma.event.findMany({
      where: {
        establishment: {
          primaryOwnerId: userId,
        },
      },
      include: {
        establishment: true,
        categories: true
      },
      orderBy: {
        createdAt: 'asc', // se tiver isso
      },
    });
  }



  // Obter evento pelo ID
 async getEventById(eventId: number) {
  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      establishment: {
        select: {
          primaryOwnerId: true
        }
      }
    }
  });
}


  // Atualizar um evento existente
  async updateEvent(eventId: number, data: Partial<{
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date | null; // Ajustando para Date ou null
    imageUrl?: string;
    latitude?: number; // Inclui latitude para atualização
    longitude?: number; // Inclui longitude para atualização
  }>): Promise<Event> {
    return prisma.event.update({
      where: { id: eventId },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate ?? null, // Se endDate for undefined, será atribuído null
        imageUrl: data.imageUrl,
        latitude: data.latitude, // Atualiza latitude se fornecido
        longitude: data.longitude, // Atualiza longitude se fornecido
      },
    });
  }

  async deleteEvent(eventId: number): Promise<void> {
    // Deleta todas as categorias relacionadas ao evento
    await prisma.eventCategory.deleteMany({
      where: { eventId },
    });

    // Deleta todos os artistas relacionados ao evento (se existir essa relação)
    await prisma.artist.deleteMany({
      where: { id: eventId },
    });

    // Agora sim, deleta o evento
    await prisma.event.delete({
      where: { id: eventId },
    });
  }
}