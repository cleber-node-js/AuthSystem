"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EventService {
    async createEvent(data) {
        return await prisma.event.create({ data });
    }
    async getAllEvents() {
        return await prisma.event.findMany();
    }
    async getEventById(eventId) {
        return await prisma.event.findUnique({ where: { id: eventId } });
    }
    async updateEvent(eventId, data) {
        return await prisma.event.update({ where: { id: eventId }, data });
    }
    async deleteEvent(eventId) {
        return await prisma.event.delete({ where: { id: eventId } });
    }
}
exports.EventService = EventService;
//# sourceMappingURL=eventService.js.map