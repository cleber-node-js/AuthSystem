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
        return prisma.event.findMany();
    }

    // Obter evento pelo ID
    async getEventById(eventId: number): Promise<Event | null> {
        return prisma.event.findUnique({ where: { id: eventId } });
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

    // Excluir um evento
    async deleteEvent(eventId: number): Promise<Event> {
        return prisma.event.delete({ where: { id: eventId } });
    }
}