import { Request, Response } from 'express';
import { ClassificationService } from '../services/ClassificationService';

const classificationService = new ClassificationService();

export class ClassificationController {
    async createClassification(req: Request, res: Response): Promise<Response> {
        const { userId, eventId, score, comment } = req.body;

        try {
            const classification = await classificationService.createClassification(userId, eventId, score, comment);
            console.log(`Classificação criada:`, classification);
            return res.status(201).json(classification);
        } catch (error: any) {
            console.error(`Erro ao criar classificação: ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAllClassifications(req: Request, res: Response): Promise<Response> {
        try {
            const classifications = await classificationService.getAllClassifications();
            console.log(`Todas as classificações:`, classifications);
            return res.status(200).json(classifications);
        } catch (error: any) {
            console.error(`Erro ao obter classificações: ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
    }

    async getClassificationById(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        try {
            const classification = await classificationService.getClassificationById(id);
            if (!classification) {
                console.warn(`Classificação não encontrada para o ID ${id}`);
                return res.status(404).json({ error: 'Classificação não encontrada' });
            }
            console.log(`Classificação encontrada:`, classification);
            return res.status(200).json(classification);
        } catch (error: any) {
            console.error(`Erro ao obter classificação ID ${id}: ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
    }

    async updateClassification(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        const { userId, eventId, score, comment } = req.body;

        try {
            const updatedClassification = await classificationService.updateClassification(id, userId, eventId, score, comment);
            console.log(`Classificação ID ${id} atualizada:`, updatedClassification);
            return res.status(200).json(updatedClassification);
        } catch (error: any) {
            console.error(`Erro ao atualizar classificação ID ${id}: ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
    }

    async deleteClassification(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        try {
            const deletedClassification = await classificationService.deleteClassification(id);
            console.log(`Classificação ID ${id} deletada:`, deletedClassification);
            return res.status(200).json(deletedClassification);
        } catch (error: any) {
            console.error(`Erro ao deletar classificação ID ${id}: ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
    }
}
