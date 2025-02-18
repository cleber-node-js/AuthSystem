import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

const eventService = new EventService();

export class EventController {
    async create(req: Request, res: Response): Promise<Response> {
        const { name, description, startDate, endDate, establishmentId } = req.body;
        try {
            const event = await eventService.createEvent({ name, description, startDate, endDate, establishmentId });
            console.log('Evento criado:', event);
            return res.status(201).json(event);
        } catch (error: any) {
            console.error('Erro ao criar evento:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const events = await eventService.getAllEvents();
            console.log('Eventos recuperados:', events);
            return res.status(200).json(events);
        } catch (error: any) {
            console.error('Erro ao recuperar eventos:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar eventos' });
        }
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const eventId = Number(req.params.id);
        try {
            const event = await eventService.getEventById(eventId);
            if (!event) {
                console.warn(`Evento com ID ${eventId} não encontrado.`);
                return res.status(404).json({ error: 'Event not found' });
            }
            console.log(`Evento ${eventId} recuperado:`, event);
            return res.status(200).json(event);
        } catch (error: any) {
            console.error('Erro ao recuperar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar evento' });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const eventId = Number(req.params.id);
        const data = req.body;
        try {
            const updatedEvent = await eventService.updateEvent(eventId, data);
            console.log(`Evento ${eventId} atualizado:`, updatedEvent);
            return res.status(200).json(updatedEvent);
        } catch (error: any) {
            console.error('Erro ao atualizar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const eventId = Number(req.params.id);
        try {
            await eventService.deleteEvent(eventId);
            console.log(`Evento ${eventId} excluído.`);
            return res.status(200).json({ message: 'Event deleted' });
        } catch (error: any) {
            console.error('Erro ao excluir evento:', error.message);
            return res.status(500).json({ error: 'Erro ao excluir evento' });
        }
    }
}
