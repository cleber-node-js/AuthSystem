"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistController = void 0;
const ArtistService_1 = require("../services/ArtistService");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const artistService = new ArtistService_1.ArtistService();
class ArtistController {
    /**
     * 🔹 Criação de um novo artista com upload de imagem
     */
    async create(req, res) {
        try {
            const { name, genre, bio, establishmentId, status } = req.body;
            // Converte o ID do estabelecimento para um número inteiro
            const parsedEstablishmentId = parseInt(establishmentId, 10);
            // Verifica se os parâmetros obrigatórios foram passados corretamente
            if (!name || isNaN(parsedEstablishmentId)) {
                return res.status(400).json({ error: 'Nome e ID do estabelecimento são obrigatórios.' });
            }
            // Pega a URL da imagem se o arquivo foi enviado
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
            // Chama o serviço para criar o artista
            const { artist, requestToken } = await artistService.createArtist(name, genre, parsedEstablishmentId, bio, status, imageUrl);
            // Retorna a resposta com o artista criado e o token de solicitação
            return res.status(201).json({ artist, requestToken });
        }
        catch (error) {
            console.error(`❌ Erro ao criar artista:`, error);
            return res.status(400).json({ error: 'Erro ao criar artista.' });
        }
    }
    /**
     * 🔹 Solicitação de apresentação no estabelecimento pelo artista.
     */
    async requestShow(req, res) {
        try {
            const { artistId, establishmentId } = req.body;
            const parsedArtistId = parseInt(artistId, 10);
            const parsedEstablishmentId = parseInt(establishmentId, 10);
            if (isNaN(parsedArtistId) || isNaN(parsedEstablishmentId)) {
                return res.status(400).json({ error: 'ID do artista e do estabelecimento devem ser números válidos.' });
            }
            const { artist, requestToken } = await artistService.requestShow(parsedArtistId, parsedEstablishmentId);
            return res.status(201).json({ artist, requestToken });
        }
        catch (error) {
            console.error(`❌ Erro na solicitação de show:`, error);
            return res.status(400).json({ error: error instanceof Error ? error.message : 'Erro na solicitação de show.' });
        }
    }
    /**
     * 🔹 Aprova ou rejeita a solicitação de apresentação do artista.
     */
    async respondToShowRequest(req, res) {
        try {
            const { requestToken, status, approvalMessage } = req.body;
            const ownerId = Number(req.userId);
            if (!requestToken || !["APPROVED", "REJECTED"].includes(status)) {
                return res.status(400).json({ error: 'Token e status (APPROVED/REJECTED) são obrigatórios.' });
            }
            if (isNaN(ownerId)) {
                return res.status(403).json({ error: 'Usuário não autenticado.' });
            }
            // Decodifica o token com os dados do artista e estabelecimento
            const decoded = jsonwebtoken_1.default.decode(requestToken);
            if (!decoded || isNaN(decoded.artistId) || isNaN(decoded.establishmentId)) {
                return res.status(400).json({ error: 'Token inválido ou malformado.' });
            }
            const updatedArtist = await artistService.respondToShowRequest(requestToken, ownerId, status, approvalMessage);
            if (updatedArtist && updatedArtist.name) {
                // Simulando notificação ao artista
                console.log(`📢 Notificação enviada ao artista ${updatedArtist.name}: ${status} - ${approvalMessage || ''}`);
            }
            else {
                console.log('📢 Notificação não enviada: artista não encontrado ou resposta inválida.');
            }
            return res.status(200).json({
                message: `Artista ${status === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso.`,
                artist: updatedArtist,
            });
        }
        catch (error) {
            console.error('❌ Erro ao processar solicitação:', error);
            return res.status(400).json({ error: error instanceof Error ? error.message : 'Erro interno.' });
        }
    }
    async getArtist(req, res) {
        try {
            const artistId = Number(req.params.id);
            if (isNaN(artistId))
                return res.status(400).json({ error: 'ID do artista inválido.' });
            const artist = await artistService.getArtistById(artistId);
            if (artist === null)
                return res.status(404).json({ error: 'Artista não encontrado.' });
            return res.status(200).json(artist);
        }
        catch (error) {
            console.error('❌ Erro ao obter artista:', error);
            return res.status(500).json({ error: 'Erro ao obter artista.' });
        }
    }
    async getAll(req, res) {
        try {
            const artists = await artistService.getAllArtists();
            return res.status(200).json(artists);
        }
        catch (error) {
            console.error('❌ Erro ao obter artistas:', error);
            return res.status(500).json({ error: 'Erro ao obter artistas.' });
        }
    }
    async update(req, res) {
        try {
            const artistId = Number(req.params.id);
            const data = req.body;
            if (isNaN(artistId))
                return res.status(400).json({ error: 'ID do artista inválido.' });
            const updatedArtist = await artistService.updateArtist(artistId, data);
            return res.status(200).json(updatedArtist);
        }
        catch (error) {
            console.error('❌ Erro ao atualizar artista:', error);
            return res.status(500).json({ error: 'Erro ao atualizar artista.' });
        }
    }
    async delete(req, res) {
        try {
            const artistId = Number(req.params.id);
            if (isNaN(artistId))
                return res.status(400).json({ error: 'ID do artista inválido.' });
            const deletedArtist = await artistService.deleteArtist(artistId);
            return res.status(200).json({ message: 'Artista excluído com sucesso.', artist: deletedArtist });
        }
        catch (error) {
            console.error('❌ Erro ao excluir artista:', error);
            return res.status(500).json({ error: 'Erro ao excluir artista.' });
        }
    }
    async getArtistsByStatus(req, res) {
        try {
            const establishmentId = Number(req.params.establishmentId);
            const status = req.params.status;
            if (isNaN(establishmentId)) {
                return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
            }
            const artists = await artistService.getArtistsByStatus(establishmentId, status);
            return res.status(200).json(artists);
        }
        catch (error) {
            console.error('❌ Erro ao buscar artistas por status:', error);
            return res.status(500).json({ error: 'Erro ao buscar artistas.' });
        }
    }
    async getArtistsByEstablishment(req, res) {
        try {
            const establishmentId = Number(req.params.establishmentId);
            if (isNaN(establishmentId)) {
                return res.status(400).json({ error: 'ID do estabelecimento inválido.' });
            }
            const artists = await artistService.getArtistsByEstablishment(establishmentId);
            return res.status(200).json(artists);
        }
        catch (error) {
            console.error('❌ Erro ao buscar artistas do estabelecimento:', error);
            return res.status(500).json({ error: 'Erro ao buscar artistas.' });
        }
    }
    async approveShow(req, res) {
        try {
            const { requestToken, approvalMessage } = req.body;
            const ownerId = Number(req.userId);
            const updatedArtist = await artistService.respondToShowRequest(requestToken, ownerId, client_1.ArtistStatus.APPROVED, approvalMessage);
            return res.status(200).json({ message: 'Artista aprovado com sucesso.', artist: updatedArtist });
        }
        catch (error) {
            console.error('❌ Erro ao aprovar artista:', error);
            return res.status(500).json({ error: 'Erro ao aprovar artista.' });
        }
    }
}
exports.ArtistController = ArtistController;
//# sourceMappingURL=ArtistController.js.map