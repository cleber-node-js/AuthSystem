import { Request, Response } from 'express';
import { EventService } from '../services/eventService';

const eventService = new EventService();

export class EventController {
    // Criar um novo evento
    async create(req: Request, res: Response): Promise<Response> {
        const { name, description, startDate, endDate, establishmentId } = req.body;
        const imageFile = req.file;

        // Depuração para verificar as datas recebidas
        console.log('startDate:', startDate);
        console.log('endDate:', endDate);  // Verifique se o valor de endDate está correto

        // ✅ Validação básica de datas
        if (!startDate || isNaN(Date.parse(startDate))) {
            return res.status(400).json({ error: 'Data de início inválida.' });
        }

        if (endDate && isNaN(Date.parse(endDate))) {
            return res.status(400).json({ error: 'Data de término inválida.' });
        }

        try {
            const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : undefined;

            const event = await eventService.createEvent({
                name,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined, // Verifique como o endDate é passado
                establishmentId: Number(establishmentId),
                imageUrl,
            });

            console.log('Evento criado:', event);
            return res.status(201).json(event);
        } catch (error: any) {
            console.error('Erro ao criar evento:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    // Obter todos os eventos
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

    // Obter evento pelo ID
    async getById(req: Request, res: Response): Promise<Response> {
        const eventId = Number(req.params.id);
        try {
            const event = await eventService.getEventById(eventId);
            if (!event) {
                console.warn(`Evento com ID ${eventId} não encontrado.`);
                return res.status(404).json({ error: 'Evento não encontrado' });
            }
            console.log(`Evento ${eventId} recuperado:`, event);
            return res.status(200).json(event);
        } catch (error: any) {
            console.error('Erro ao recuperar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar evento' });
        }
    }

    // Atualizar um evento existente
    async update(req: Request, res: Response): Promise<Response> {
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
                imageUrl,
            });

            console.log(`Evento ${eventId} atualizado:`, updatedEvent);
            return res.status(200).json(updatedEvent);
        } catch (error: any) {
            console.error('Erro ao atualizar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    }

    // Excluir um evento
    async delete(req: Request, res: Response): Promise<Response> {
        const eventId = Number(req.params.id);
        try {
            await eventService.deleteEvent(eventId);
            console.log(`Evento ${eventId} excluído.`);
            return res.status(200).json({ message: 'Evento excluído com sucesso' });
        } catch (error: any) {
            console.error('Erro ao excluir evento:', error.message);
            return res.status(500).json({ error: 'Erro ao excluir evento' });
        }
    }
}
