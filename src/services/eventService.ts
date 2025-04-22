import { PrismaClient, Event } from '@prisma/client';

const prisma = new PrismaClient();

export class EventService {
    // Criar um novo evento
    async createEvent(data: {
        name: string;
        description?: string;
        startDate: Date;
        endDate?: Date | null; // Mantendo apenas Date ou null
        establishmentId: number;
        imageUrl?: string;
    }): Promise<Event> {
        return await prisma.event.create({
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate, // Remove fallback to null
                establishmentId: data.establishmentId,
                imageUrl: data.imageUrl || null,
            },
        });
    }

    // Obter todos os eventos
    async getAllEvents(): Promise<Event[]> {
        return await prisma.event.findMany();
    }

    // Obter evento pelo ID
    async getEventById(eventId: number): Promise<Event | null> {
        return await prisma.event.findUnique({ where: { id: eventId } });
    }

    // Atualizar um evento existente
    async updateEvent(eventId: number, data: Partial<{
        name: string;
        description?: string;
        startDate?: Date;
        endDate?: Date | null; // Ajustando para Date ou null
        imageUrl?: string;
    }>): Promise<Event> {
        return await prisma.event.update({
            where: { id: eventId },
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate ?? null, // Se endDate for undefined, será atribuído null
                imageUrl: data.imageUrl,
            },
        });
    }

    // Excluir um evento
    async deleteEvent(eventId: number): Promise<Event> {
        return await prisma.event.delete({ where: { id: eventId } });
    }
}
