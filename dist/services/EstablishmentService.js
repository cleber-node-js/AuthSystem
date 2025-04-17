"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablishmentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}
class EstablishmentService {
    // ✅ Criar um novo estabelecimento
    async createEstablishment(name, address, contact, primaryOwnerId) {
        if (!name || !primaryOwnerId) {
            throw new Error('Nome e ID do proprietário são obrigatórios para criar um estabelecimento.');
        }
        return prisma.establishment.create({
            data: { name, address, contact, primaryOwnerId },
        });
    }
    // 🔍 Buscar estabelecimento por ID
    async getEstablishmentById(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(`ID do estabelecimento inválido: ${id}`);
        }
        const establishment = await prisma.establishment.findUnique({
            where: { id },
        });
        if (!establishment) {
            throw new NotFoundError(`Estabelecimento com ID ${id} não encontrado.`);
        }
        return establishment;
    }
    // 🔍 Buscar todos os estabelecimentos
    async getAllEstablishments() {
        return prisma.establishment.findMany();
    }
    // 🔎 Buscar artistas por estabelecimento e status
    async getArtistsByEstablishmentAndStatus(establishmentId, status) {
        if (!Number.isInteger(establishmentId) || establishmentId <= 0) {
            throw new Error('ID do estabelecimento inválido.');
        }
        const whereClause = {
            establishments: {
                some: {
                    establishmentId,
                },
            },
        };
        if (status) {
            const normalizedStatus = status.toUpperCase().trim();
            if (!['PENDING', 'APPROVED', 'REJECTED'].includes(normalizedStatus)) {
                throw new Error('Status inválido. Use PENDING, APPROVED ou REJECTED.');
            }
            whereClause.establishments.some.status = normalizedStatus;
        }
        return prisma.artist.findMany({
            where: whereClause,
            include: { establishments: true },
        });
    }
    // ✏️ Atualizar um estabelecimento
    async updateEstablishment(id, data) {
        await this.getEstablishmentById(id); // valida existência
        return prisma.establishment.update({
            where: { id },
            data,
        });
    }
    // 🗑️ Excluir um estabelecimento
    async deleteEstablishment(id) {
        await this.getEstablishmentById(id); // valida existência
        await prisma.establishment.delete({
            where: { id },
        });
        return { message: `Estabelecimento com ID ${id} foi excluído com sucesso.` };
    }
    // 🎤 Atualizar o status de um artista no relacionamento com o estabelecimento
    async updateArtistStatus(establishmentId, artistId, status) {
        if (!Number.isInteger(establishmentId) || establishmentId <= 0 ||
            !Number.isInteger(artistId) || artistId <= 0) {
            throw new Error('IDs do estabelecimento ou do artista inválidos.');
        }
        const relation = await prisma.establishmentArtists.findFirst({
            where: {
                artistId,
                establishmentId,
            },
        });
        if (!relation) {
            throw new NotFoundError(`Artista com ID ${artistId} não está vinculado ao estabelecimento ${establishmentId}.`);
        }
        await prisma.establishmentArtists.update({
            where: {
                artistId_establishmentId: {
                    artistId,
                    establishmentId,
                },
            },
            data: { status },
        });
        return { message: `Status do artista com ID ${artistId} no estabelecimento ${establishmentId} atualizado para ${status}.` };
    }
}
exports.EstablishmentService = EstablishmentService;
//# sourceMappingURL=EstablishmentService.js.map