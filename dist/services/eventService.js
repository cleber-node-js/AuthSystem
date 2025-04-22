"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EventService {
    // Criar um novo evento
    async createEvent(data) {
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
    async getAllEvents() {
        return await prisma.event.findMany();
    }
    // Obter evento pelo ID
    async getEventById(eventId) {
        return await prisma.event.findUnique({ where: { id: eventId } });
    }
    // Atualizar um evento existente
    async updateEvent(eventId, data) {
        var _a;
        return await prisma.event.update({
            where: { id: eventId },
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: (_a = data.endDate) !== null && _a !== void 0 ? _a : null, // Se endDate for undefined, será atribuído null
                imageUrl: data.imageUrl,
            },
        });
    }
    // Excluir um evento
    async deleteEvent(eventId) {
        return await prisma.event.delete({ where: { id: eventId } });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map