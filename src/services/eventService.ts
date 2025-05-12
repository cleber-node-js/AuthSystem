import { PrismaClient, Event } from '@prisma/client';

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
    establishment_id: number;
    categories: string[];
    artists: number[];
  }): Promise<Event> {

    const categoryEntities = await prisma.category.findMany({
      where: {
        name: {
          in: eventData.categories.map(category => category.toUpperCase()),
        }
      }
    })

    return prisma.event.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        imageUrl: eventData.imageUrl || "https://default-image-url.com/image.jpg", // ✅ Corrigido!
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        latitude: eventData.latitude,
        longitude: eventData.longitude,
        establishment_id: eventData.establishment_id,
        categories: {
          create: categoryEntities.map(category => ({
            category: {
              connect: { id: category.id }
            }
          }))
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

    // Agrupa os eventos por establishment_id
    for (const event of events) {
      const establishment_id = event.establishment_id;

      if (!grouped[establishment_id]) {
        grouped[establishment_id] = [];
      }

      grouped[establishment_id].push(event);
    }

    // Transforma o objeto em array organizado
    return Object.entries(grouped).map(([establishment_id, events]) => ({
      establishment: Number(establishment_id),
      events,
    }));
  }

  async getAllEventsByUserId(user_id: number) {
    return await prisma.event.findMany({
      where: {
        establishment: {
          primaryOwner_id: user_id,
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
  async getEventById(event_id: number) {
    return prisma.event.findUnique({
      where: { id: event_id },
      include: {
        establishment: {
          select: {
            primaryOwner_id: true
          }
        }
      }
    });
  }


  // Atualizar um evento existente
  async updateEvent(event_id: number, data: Partial<{
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date | null; // Ajustando para Date ou null
    imageUrl?: string;
    latitude?: number; // Inclui latitude para atualização
    longitude?: number; // Inclui longitude para atualização
  }>): Promise<Event> {
    return prisma.event.update({
      where: { id: event_id },
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

  async deleteEvent(event_id: number): Promise<void> {
    // Deleta todas as categorias relacionadas ao evento
    await prisma.eventCategory.deleteMany({
      where: { event_id },
    });

    // Deleta todos os artistas relacionados ao evento (se existir essa relação)
    await prisma.artist.deleteMany({
      where: { id: event_id },
    });

    // Agora sim, deleta o evento
    await prisma.event.delete({
      where: { id: event_id },
    });
  }
}