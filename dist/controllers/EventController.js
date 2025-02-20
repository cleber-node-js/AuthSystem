"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const eventService_1 = require("../services/eventService");
const eventService = new eventService_1.EventService();
class EventController {
    async create(req, res) {
        const { name, description, startDate, endDate, establishmentId } = req.body;
        try {
            const event = await eventService.createEvent({ name, description, startDate, endDate, establishmentId });
            console.log('Evento criado:', event);
            return res.status(201).json(event);
        }
        catch (error) {
            console.error('Erro ao criar evento:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const events = await eventService.getAllEvents();
            console.log('Eventos recuperados:', events);
            return res.status(200).json(events);
        }
        catch (error) {
            console.error('Erro ao recuperar eventos:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar eventos' });
        }
    }
    async getById(req, res) {
        const eventId = Number(req.params.id);
        try {
            const event = await eventService.getEventById(eventId);
            if (!event) {
                console.warn(`Evento com ID ${eventId} não encontrado.`);
                return res.status(404).json({ error: 'Event not found' });
            }
            console.log(`Evento ${eventId} recuperado:`, event);
            return res.status(200).json(event);
        }
        catch (error) {
            console.error('Erro ao recuperar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar evento' });
        }
    }
    async update(req, res) {
        const eventId = Number(req.params.id);
        const data = req.body;
        try {
            const updatedEvent = await eventService.updateEvent(eventId, data);
            console.log(`Evento ${eventId} atualizado:`, updatedEvent);
            return res.status(200).json(updatedEvent);
        }
        catch (error) {
            console.error('Erro ao atualizar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    }
    async delete(req, res) {
        const eventId = Number(req.params.id);
        try {
            await eventService.deleteEvent(eventId);
            console.log(`Evento ${eventId} excluído.`);
            return res.status(200).json({ message: 'Event deleted' });
        }
        catch (error) {
            console.error('Erro ao excluir evento:', error.message);
            return res.status(500).json({ error: 'Erro ao excluir evento' });
        }
    }
}
exports.EventController = EventController;
//# sourceMappingURL=EventController.js.map