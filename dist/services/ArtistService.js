"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistService = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class ArtistService {
    respondToShowRequest(requestToken, ownerId, arg2, approvalMessage) {
        throw new Error('Method not implemented.');
    }
    constructor() { }
    async requestShow(artistId, establishmentId) {
        // 🔍 Verificar se o artista já solicitou apresentação neste estabelecimento
        const existingRequest = await prisma.establishmentArtists.findUnique({
            where: {
                artistId_establishmentId: {
                    artistId,
                    establishmentId,
                },
            },
        });
        if (existingRequest) {
            throw new Error(`Artista já solicitou apresentação neste estabelecimento.`);
        }
        // 🔍 Verificar se o artista e o estabelecimento existem
        const artist = await prisma.artist.findUnique({ where: { id: artistId } });
        if (!artist) {
            throw new Error(`Artista com ID ${artistId} não encontrado.`);
        }
        const establishment = await prisma.establishment.findUnique({ where: { id: establishmentId } });
        if (!establishment) {
            throw new Error(`Estabelecimento com ID ${establishmentId} não encontrado.`);
        }
        // ✅ Criar a relação artista-estabelecimento
        await prisma.establishmentArtists.create({
            data: {
                artistId,
                establishmentId,
                status: client_1.ArtistStatus.PENDING,
                approvalMessage: null,
            },
        });
        // 🔑 Gerar token de solicitação
        const requestToken = jsonwebtoken_1.default.sign({ artistId, establishmentId }, "your_secret_key", // Altere para sua chave secreta
        { expiresIn: "7d" });
        return { artist, requestToken };
    }
    /**
     * 🔹 Cria um novo artista e vincula ao estabelecimento.
     */
    async createArtist(name, genre = '', establishmentId, bio, status = client_1.ArtistStatus.PENDING, imageUrl // 👈 aceita URL da imagem
    ) {
        console.log("🔍 Iniciando criação do artista...");
        const parsedEstablishmentId = Number(establishmentId);
        if (isNaN(parsedEstablishmentId)) {
            throw new Error('O ID do estabelecimento deve ser um número válido.');
        }
        const establishment = await prisma.establishment.findUnique({
            where: { id: parsedEstablishmentId },
        });
        if (!establishment) {
            throw new Error(`Estabelecimento com ID ${parsedEstablishmentId} não encontrado.`);
        }
        const artist = await prisma.artist.create({
            data: {
                name,
                genre,
                bio,
                imageUrl: imageUrl || "https://default-image-url.com/artist.jpg", // ✅ Nunca será null!
                status,
                establishments: {
                    create: {
                        establishment: { connect: { id: parsedEstablishmentId } },
                        status,
                    },
                },
            },
        });
        const requestToken = jsonwebtoken_1.default.sign({ artistId: artist.id, establishmentId: parsedEstablishmentId }, "your_secret_key", // Altere para sua chave secreta
        { expiresIn: "7d" });
        console.log(`✅ Artista criado com sucesso. Token gerado: ${requestToken}`);
        return { artist, requestToken };
    }
    /**
     * 🔹 Retorna todos os artistas cadastrados.
     */
    async getAllArtists() {
        try {
            const artists = await prisma.artist.findMany({
                include: {
                    establishments: true,
                },
            });
            return artists;
        }
        catch (error) {
            console.error("❌ Erro ao buscar todos os artistas:", error);
            throw new Error("Erro ao buscar artistas.");
        }
    }
    /**
     * 🔹 Buscar artista por ID.
     */
    async getArtistById(artistId) {
        try {
            const artist = await prisma.artist.findUnique({
                where: { id: artistId },
                include: { establishments: true },
            });
            return artist;
        }
        catch (error) {
            console.error(`❌ Erro ao buscar artista ID ${artistId}:`, error);
            throw new Error("Erro ao buscar artista.");
        }
    }
    /**
     * 🔹 Atualizar informações de um artista.
     */
    async updateArtist(artistId, data) {
        try {
            const updatedArtist = await prisma.artist.update({
                where: { id: artistId },
                data,
                include: { establishments: true },
            });
            return updatedArtist;
        }
        catch (error) {
            console.error(`❌ Erro ao atualizar artista ID ${artistId}:`, error);
            throw new Error("Erro ao atualizar artista.");
        }
    }
    /**
     * 🔹 Soft delete de um artista (marca como inativo).
     */
    async deleteArtist(artistId) {
        try {
            const deletedArtist = await prisma.artist.update({
                where: { id: artistId },
                data: { status: client_1.ArtistStatus.ACTIVE },
            });
            return deletedArtist;
        }
        catch (error) {
            console.error(`❌ Erro ao excluir artista ID ${artistId}:`, error);
            throw new Error("Erro ao excluir artista.");
        }
    }
    /**
     * 🔹 Buscar artistas por status.
     */
    async getArtistsByStatus(establishmentId, status) {
        try {
            const artists = await prisma.artist.findMany({
                where: {
                    establishments: {
                        some: { establishmentId },
                    },
                    status,
                },
                include: { establishments: true },
            });
            if (artists.length === 0) {
                throw new Error(`Nenhum artista encontrado com status ${status}.`);
            }
            return artists;
        }
        catch (error) {
            console.error("❌ Erro ao buscar artistas por status:", error);
            throw new Error("Erro ao buscar artistas por status.");
        }
    }
    /**
     * 🔹 Buscar artistas de um estabelecimento específico.
     */
    async getArtistsByEstablishment(establishmentId) {
        try {
            console.log(`🔍 Buscando artistas do estabelecimento ID: ${establishmentId}`);
            const artists = await prisma.artist.findMany({
                where: {
                    establishments: {
                        some: {
                            establishmentId,
                        },
                    },
                },
                include: {
                    establishments: true,
                },
            });
            if (artists.length === 0) {
                console.warn(`⚠️ Nenhum artista encontrado para o estabelecimento ID: ${establishmentId}`);
                throw new Error("Nenhum artista encontrado para este estabelecimento.");
            }
            console.log(`✅ Artistas encontrados: ${artists.length}`);
            return artists;
        }
        catch (error) {
            console.error("❌ Erro ao buscar artistas do estabelecimento:", error);
            throw new Error("Erro ao buscar artistas do estabelecimento.");
        }
    }
}
exports.ArtistService = ArtistService;
//# sourceMappingURL=ArtistService.js.map