"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EventService {
    // Criar um novo evento
    async createEvent(eventData) {
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
                    create: eventData.categories.map(category => ({ category: category.toUpperCase() }))
                },
                artists: {
                    connect: eventData.artists.map(artistId => ({ id: artistId }))
                }
            }
        });
    }
    // Obter todos os eventos
    async getAllEvents() {
        return prisma.event.findMany();
    }
    // Obter evento pelo ID
    async getEventById(eventId) {
        return prisma.event.findUnique({ where: { id: eventId } });
    }
    // Atualizar um evento existente
    async updateEvent(eventId, data) {
        var _a;
        return prisma.event.update({
            where: { id: eventId },
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: (_a = data.endDate) !== null && _a !== void 0 ? _a : null, // Se endDate for undefined, será atribuído null
                imageUrl: data.imageUrl,
                latitude: data.latitude, // Atualiza latitude se fornecido
                longitude: data.longitude, // Atualiza longitude se fornecido
            },
        });
    }
    // Excluir um evento
    async deleteEvent(eventId) {
        return prisma.event.delete({ where: { id: eventId } });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map