import { PrismaClient, Event } from '@prisma/client';

const prisma = new PrismaClient();

export class EventService {
    async createEvent(data: { name: string, description?: string, startDate: Date, endDate: Date, establishmentId: number }): Promise<Event> {
        return await prisma.event.create({ data });
    }

    async getAllEvents(): Promise<Event[]> {
        return await prisma.event.findMany();
    }

    async getEventById(eventId: number): Promise<Event | null> {
        return await prisma.event.findUnique({ where: { id: eventId } });
    }

    async updateEvent(eventId: number, data: Partial<{ name: string, description?: string, startDate?: Date, endDate?: Date }>): Promise<Event> {
        return await prisma.event.update({ where: { id: eventId }, data });
    }

    async deleteEvent(eventId: number): Promise<Event> {
        return await prisma.event.delete({ where: { id: eventId } });
    }
}