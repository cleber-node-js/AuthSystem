import { Request, Response } from 'express';
import { SessionService } from '../services/SessionService';

export class SessionController {
    private sessionService: SessionService;

    constructor() {
        this.sessionService = new SessionService();
    }

    // Criar uma nova sessão
    public async createSession(req: Request, res: Response) {
        try {
            const { user_id } = req.body;
            const newSession = await this.sessionService.createSession(user_id);

            console.log(`✅ Sessão criada com sucesso:`, newSession);

            return res.status(201).json(newSession);
        } catch (error) {
            console.error('❌ Erro ao criar sessão:', error);
            return res.status(500).json({ error: 'Erro ao criar sessão' });
        }
    }

    // Obter todas as sessões
    public async getAllSessions(req: Request, res: Response) {
        try {
            const sessions = await this.sessionService.getAllSessions();
            console.log(`📋 Lista de sessões:`, sessions);
            return res.status(200).json(sessions);
        } catch (error) {
            console.error('❌ Erro ao buscar sessões:', error);
            return res.status(500).json({ error: 'Erro ao buscar sessões' });
        }
    }

    // Obter uma sessão por ID
    public async getSessionById(req: Request, res: Response) {
        try {
            const sessionId = parseInt(req.params.id);
            const session = await this.sessionService.getSessionById(sessionId);

            if (!session) {
                console.log(`⚠️ Sessão ID ${sessionId} não encontrada.`);
                return res.status(404).json({ error: 'Sessão não encontrada' });
            }

            console.log(`🔍 Sessão encontrada:`, session);
            return res.status(200).json(session);
        } catch (error) {
            console.error('❌ Erro ao buscar sessão:', error);
            return res.status(500).json({ error: 'Erro ao buscar sessão' });
        }
    }

    // Atualizar uma sessão
    public async updateSession(req: Request, res: Response) {
        try {
            const sessionId = parseInt(req.params.id);
            const updatedSession = await this.sessionService.updateSession(sessionId, req.body);

            if (!updatedSession) {
                console.log(`⚠️ Sessão ID ${sessionId} não encontrada para atualização.`);
                return res.status(404).json({ error: 'Sessão não encontrada' });
            }

            console.log(`🔄 Sessão atualizada com sucesso:`, updatedSession);
            return res.status(200).json(updatedSession);
        } catch (error) {
            console.error('❌ Erro ao atualizar sessão:', error);
            return res.status(500).json({ error: 'Erro ao atualizar sessão' });
        }
    }

    // Deletar uma sessão
    public async deleteSession(req: Request, res: Response) {
        try {
            const sessionId = parseInt(req.params.id);
            const deletedSession = await this.sessionService.deleteSession(sessionId);

            if (!deletedSession) {
                console.log(`⚠️ Sessão ID ${sessionId} não encontrada para deleção.`);
                return res.status(404).json({ error: 'Sessão não encontrada' });
            }

            console.log(`🗑️ Sessão deletada com sucesso:`, deletedSession);
            return res.status(200).json({ message: 'Sessão deletada com sucesso' });
        } catch (error) {
            console.error('❌ Erro ao deletar sessão:', error);
            return res.status(500).json({ error: 'Erro ao deletar sessão' });
        }
    }
}
