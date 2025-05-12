import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import fs from 'fs';
import sharp from 'sharp';
import cloudinary from '../utils/cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { json } from 'body-parser';

interface Event {
    name: string;
    description?: string;
    imageUrl?: string;
    startDate: Date;
    endDate?: Date;
    latitude: number;
    longitude: number;
    establishment_id: number;
    categories: string[];
    artists: number[];
}

interface EventGroupedByEstablishment {
    establishment_id: number;
    events: Event[];
}

const eventService = new EventService();

export class EventController {
    // Criar um novo evento
    async create(req: Request, res: Response): Promise<Response> {
        const { name, description, startDate, endDate, establishment_id, categories, artists } = req.body;

        let parsedCategories: string[] = [];
        if (typeof categories === 'string') {
            try {
                parsedCategories = JSON.parse(categories);
            } catch (error) {
                console.error('Erro ao fazer parse das categorias:', error);
                parsedCategories = [];
            }
        }

        const imageFile = req.file;

        // Validação de datas
        if (!startDate || isNaN(Date.parse(startDate))) {
            return res.status(400).json({ error: 'Data de início inválida.' });
        }

        if (endDate && isNaN(Date.parse(endDate))) {
            return res.status(400).json({ error: 'Data de término inválida.' });
        }

        if (!imageFile) {
            return res.status(400).json({ error: 'Imagem obrigatória.' });
        }

        try {
            // Processamento da imagem
            const arrayBuffer = await fs.promises.readFile(imageFile.path);
            const buffer = new Uint8Array(arrayBuffer);
            const compressedBuffer = await sharp(buffer)
                .resize({ width: 800 })
                .webp({ quality: 80 })
                .toBuffer();

            // Fazendo upload da imagem para o Cloudinary
            const result: UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({
                    tags: [`${establishment_id}`],
                    folder: 'events',
                }, function (error, result) {
                    if (error) {
                        console.error('Erro ao fazer upload para o Cloudinary:', error);
                        reject(error);
                    } else {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(new Error('Upload result is undefined.'));
                        }
                    }
                }).end(compressedBuffer);
            });

            const imageUrl = result.secure_url;

            // Criando o evento
            const event = await eventService.createEvent({
                name,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined,
                establishment_id: Number(establishment_id),
                imageUrl, // URL da imagem no Cloudinary
                latitude: Number(req.body.latitude),
                longitude: Number(req.body.longitude),
                categories: parsedCategories,
                artists: artists ?? [],
            });

            console.log('Evento criado:', event);
            return res.status(201).json(event);
        } catch (error: any) {
            console.error('Erro ao criar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao criar evento.' });
        }
    }

    // Atualizar um evento existente
    async update(req: Request, res: Response): Promise<Response> {
        const event_id = Number(req.params.id);
        const user_id = req.user_id;


        try {
            // Recupera o evento existente
            const existingEvent = await eventService.getEventById(event_id);
            if (existingEvent?.establishment.primaryOwner_id !== Number(user_id)) {
                return res.status(403).json({ error: 'Você não tem permissão para atualizar este estabelecimento.' });
            }
            const { name, description } = req.body;
            const imageFile = req.file;
            const updatedData: Record<string, any> = {};

            if (name) updatedData.name = name;
            if (description) updatedData.description = description;


            // Se uma nova imagem for fornecida, processa o upload e exclui a anterior
            if (imageFile) {
                // Processa a nova imagem
                const arrayBuffer = await fs.promises.readFile(imageFile.path);
                const buffer = new Uint8Array(arrayBuffer);
                const compressedBuffer = await sharp(buffer)
                    .resize(800, 800, { fit: 'inside' })
                    .webp({ quality: 80 })
                    .toBuffer();

                // Faz o upload para o Cloudinary
                const updatedResult: UploadApiResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({
                        folder: 'events',
                    }, function (error, result) {
                        if (error) {
                            console.error('Erro ao fazer upload para o Cloudinary:', error);
                            reject(error);
                        } else {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(new Error('Upload result is undefined.'));
                            }
                        }
                    }).end(compressedBuffer);
                });

                // Excluir a imagem anterior do Cloudinary
                if (existingEvent.imageUrl) {
                    const publicIdMatch = existingEvent.imageUrl.match(/\/upload\/v\d+\/events\/(.+)\.webp/);
                    const publicId = publicIdMatch ? publicIdMatch[1] : null;

                    if (publicId) {
                        await cloudinary.uploader.destroy(`events/${publicId}`);
                        console.log('🧹 Imagem antiga deletada:', publicId);
                    } else {
                        console.warn('🧹 ID público da imagem não encontrado na URL:', existingEvent.imageUrl);
                    }
                }

                updatedData.imageUrl = updatedResult.secure_url; // A nova URL da imagem
            }

            // Atualizar o evento com os novos dados
            const updatedEvent = await eventService.updateEvent(event_id, updatedData);

            console.log(`Evento ${event_id} atualizado:`, updatedEvent);
            return res.status(200).json(updatedEvent);
        } catch (error: any) {
            console.error('Erro ao atualizar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    }

    // Excluir um evento
    async delete(req: Request, res: Response): Promise<Response> {
        const event_id = Number(req.params.id);
        console.log('ID do evento a ser excluído:', event_id);

        try {
            // Recupera o evento existente para excluir a imagem do Cloudinary
            const existingEvent = await eventService.getEventById(event_id);
            if (existingEvent && existingEvent.imageUrl) {
                const publicId = existingEvent.imageUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId); // Excluir a imagem do Cloudinary
                }
            }

            // Exclui o evento
            await eventService.deleteEvent(event_id);
            console.log(`Evento ${event_id} excluído.`);
            return res.status(200).json({ message: 'Evento excluído com sucesso' });
        } catch (error: any) {
            console.error('Erro ao excluir evento:', error.message);
            return res.status(500).json({ error: 'Erro ao excluir evento' });
        }
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        const user_id = req.user_id;
        console.log('ID do usuário autenticado:', user_id);

        if (!user_id) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        try {
            const events = await eventService.getAllEventsByUserId(Number(user_id));
            // console.log('Eventos recuperados:', events);
            return res.status(200).json(events);
        } catch (error: any) {
            console.error('Erro ao recuperar eventos:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar eventos' });
        }
    }



    async getAllClient(req: Request, res: Response): Promise<Response> {
        try {
            const events = await eventService.getAllEvents();
            console.log('Eventos recuperados:', events);
            return res.status(200).json(events);
        } catch (error: any) {
            console.error('Erro ao recuperar eventos:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar eventos' });
        }
    }


    async getAllGroupedByEstablishment(req: Request, res: Response): Promise<Response> {
        try {
            const events: EventGroupedByEstablishment[] = await eventService.getAllEventsGroupedByEstablishment();
            console.log('Eventos agrupados por estabelecimento:', JSON.stringify(events, null, 2));
            return res.status(200).json(events);
        } catch (error: any) {
            console.error('Erro ao recuperar eventos agrupados:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar eventos agrupados' });
        }
    }

    // Obter evento pelo ID
    async getById(req: Request, res: Response): Promise<Response> {
        const event_id = Number(req.params.id);
        try {
            const event = await eventService.getEventById(event_id);
            if (!event) {
                console.warn(`Evento com ID ${event_id} não encontrado.`);
                return res.status(404).json({ error: 'Evento não encontrado' });
            }
            console.log(`Evento ${event_id} recuperado:`, event);
            return res.status(200).json(event);
        } catch (error: any) {
            console.error('Erro ao recuperar evento:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar evento' });
        }
    }


}



