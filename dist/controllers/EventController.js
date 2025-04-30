"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const eventService_1 = require("../services/eventService");
const eventService = new eventService_1.EventService();
class EventController {
    // Criar um novo evento
    async create(req, res) {
        const { name, description, startDate, endDate, establishmentId, categories, artists } = req.body;
        const imageFile = req.file; // Captura o arquivo da imagem
        // Depuração para verificar as datas recebidas
        console.log('startDate:', startDate);
        console.log('endDate:', endDate);
        // ✅ Validação básica de datas
        if (!startDate || isNaN(Date.parse(startDate))) {
            return res.status(400).json({ error: 'Data de início inválida.' });
        }
        if (endDate && isNaN(Date.parse(endDate))) {
            return res.status(400).json({ error: 'Data de término inválida.' });
        }
        try {
            // Processamento da URL da imagem
            const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined;
            // Chamada ao serviço para criar o evento
            const event = await eventService.createEvent({
                name,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined,
                establishmentId: Number(establishmentId),
                imageUrl,
                latitude: Number(req.body.latitude), // Extract latitude
                longitude: Number(req.body.longitude), // Extract longitude
                categories, // Passa as categorias
                artists // Passa os artistas
            });
            console.log('Evento criado:', event);
            return res.status(201).json(event);
        }
        catch (error) {
            console.error('Erro ao criar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao criar evento.' });
        }
    }
    // Obter todos os eventos
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
    // Obter evento pelo ID
    async getById(req, res) {
        const eventId = Number(req.params.id);
        try {
            const event = await eventService.getEventById(eventId);
            if (!event) {
                console.warn(`Evento com ID ${eventId} não encontrado.`);
                return res.status(404).json({ error: 'Evento não encontrado' });
            }
            console.log(`Evento ${eventId} recuperado:`, event);
            return res.status(200).json(event);
        }
        catch (error) {
            console.error('Erro ao recuperar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar evento' });
        }
    }
    // Atualizar um evento existente
    async update(req, res) {
        const eventId = Number(req.params.id);
        const { name, description, startDate, endDate } = req.body;
        const imageFile = req.file;
        try {
            const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined;
            const updatedEvent = await eventService.updateEvent(eventId, {
                name,
                description,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                imageUrl
            });
            console.log(`Evento ${eventId} atualizado:`, updatedEvent);
            return res.status(200).json(updatedEvent);
        }
        catch (error) {
            console.error('Erro ao atualizar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    }
    // Excluir um evento
    async delete(req, res) {
        const eventId = Number(req.params.id);
        try {
            await eventService.deleteEvent(eventId);
            console.log(`Evento ${eventId} excluído.`);
            return res.status(200).json({ message: 'Evento excluído com sucesso' });
        }
        catch (error) {
            console.error('Erro ao excluir evento:', error.message);
            return res.status(500).json({ error: 'Erro ao excluir evento' });
        }
    }
}
exports.EventController = EventController;
//# sourceMappingURL=EventController.js.map