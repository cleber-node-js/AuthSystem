"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ArtistService {
    async createArtist(name, establishmentId, genre = '', bio) {
        // Verificar se o estabelecimento existe e usar o ID correto
        const establishment = await prisma.establishment.findUnique({
            where: { id: establishmentId }
        });
        if (!establishment) {
            throw new Error(`Estabelecimento com ID ${establishmentId} não encontrado.`);
        }
        // Criar o artista
        const artist = await prisma.artist.create({
            data: {
                name,
                genre,
                bio,
                establishmentId,
            },
        });
        return artist;
    }
    async getArtistById(artistId) {
        return await prisma.artist.findUnique({
            where: { id: artistId },
            include: { establishment: true },
        });
    }
    async getAllArtists() {
        return await prisma.artist.findMany({
            include: { establishment: true },
        });
    }
    async updateArtist(artistId, data) {
        return await prisma.artist.update({
            where: { id: artistId },
            data,
        });
    }
    async deleteArtist(artistId) {
        return await prisma.artist.delete({
            where: { id: artistId },
        });
    }
}
exports.ArtistService = ArtistService;
//# sourceMappingURL=ArtistService.js.map