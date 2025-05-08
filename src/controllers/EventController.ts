import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import fs from 'fs';
import sharp from 'sharp';
import cloudinary from '../utils/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

const eventService = new EventService();

export class EventController {
    // Criar um novo evento
    async create(req: Request, res: Response): Promise<Response> {
        const { name, description, startDate, endDate, establishmentId, categories, artists } = req.body;

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
                    tags: [`${establishmentId}`],
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
                establishmentId: Number(establishmentId),
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

    async getAllGroupedByEstablishment(req: Request, res: Response): Promise<Response> {
        try {
            const events = await eventService.getAllEventsGroupedByEstablishment();
            console.log('Eventos agrupados por estabelecimento:', events);
            return res.status(200).json(events);
        } catch (error: any) {
            console.error('Erro ao recuperar eventos agrupados:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar eventos agrupados' });
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
            // Recupera o evento existente
            const existingEvent = await eventService.getEventById(eventId);
            if (!existingEvent) {
                return res.status(404).json({ error: 'Evento não encontrado.' });
            }

            let imageUrl = existingEvent.imageUrl;

            // Se uma nova imagem for fornecida, processa o upload e exclui a anterior
            if (imageFile) {
                // Processa a nova imagem
                const arrayBuffer = await fs.promises.readFile(imageFile.path);
                const buffer = new Uint8Array(arrayBuffer);
                const compressedBuffer = await sharp(buffer)
                    .resize({ width: 800 })
                    .webp({ quality: 80 })
                    .toBuffer();

                // Faz o upload para o Cloudinary
                const result: UploadApiResponse = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({
                        tags: [`${existingEvent.establishmentId}`],
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

                imageUrl = result.secure_url;

                // Excluir a imagem anterior do Cloudinary
                if (existingEvent.imageUrl) {
                    const publicId = existingEvent.imageUrl.split('/').pop()?.split('.')[0]; // Extrai o public_id da URL
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId); // Exclui a imagem do Cloudinary
                    }
                }
            }

            // Atualizar o evento com os novos dados
            const updatedEvent = await eventService.updateEvent(eventId, {
                name,
                description,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                imageUrl: imageUrl ?? undefined, // A nova URL da imagem
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
        console.log('ID do evento a ser excluído:', eventId);

        try {
            // Recupera o evento existente para excluir a imagem do Cloudinary
            const existingEvent = await eventService.getEventById(eventId);
            if (existingEvent && existingEvent.imageUrl) {
                const publicId = existingEvent.imageUrl.split('/').pop()?.split('.')[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId); // Excluir a imagem do Cloudinary
                }
            }

            // Exclui o evento
            await eventService.deleteEvent(eventId);
            console.log(`Evento ${eventId} excluído.`);
            return res.status(200).json({ message: 'Evento excluído com sucesso' });
        } catch (error: any) {
            console.error('Erro ao excluir evento:', error.message);
            return res.status(500).json({ error: 'Erro ao excluir evento' });
        }
    }
}



