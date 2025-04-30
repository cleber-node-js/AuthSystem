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
    // ✅ Criar estabelecimento com imagem, localização e categorias
    async createEstablishment(name, address, contact, primaryOwnerId, latitude, longitude, categories, imageUrl // <-- novo parâmetro opcional
    ) {
        if (!name || !primaryOwnerId || !latitude || !longitude || categories.length === 0) {
            throw new Error("Nome, ID do proprietário, localização e categorias são obrigatórios.");
        }
        return prisma.establishment.create({
            data: {
                name,
                address,
                contact,
                latitude,
                longitude,
                primaryOwnerId,
                imageUrl,
                categories: {
                    create: categories.map(category => ({
                        category
                    })),
                },
            },
        });
    }
    // 🔍 Buscar estabelecimento por ID
    async getEstablishmentById(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error(`ID do estabelecimento inválido: ${id}`);
        }
        const establishment = await prisma.establishment.findUnique({
            where: { id },
            include: {
                categories: true, // Incluindo categorias ao buscar o estabelecimento
            }
        });
        if (!establishment) {
            throw new NotFoundError(`Estabelecimento com ID ${id} não encontrado.`);
        }
        return establishment;
    }
    // 🔍 Buscar todos os estabelecimentos
    async getAllEstablishments() {
        return prisma.establishment.findMany({
            include: {
                categories: true, // Incluindo categorias ao listar estabelecimentos
            }
        });
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
        await this.getEstablishmentById(id); // Valida existência
        return prisma.establishment.update({
            where: { id },
            data: {
                ...data,
                categories: data.categories ? {
                    deleteMany: {}, // Exclui todas as categorias existentes
                    create: data.categories.map(category => ({
                        category
                    })), // Adiciona novas categorias
                } : undefined,
            },
            include: {
                categories: true, // Inclui categorias no resultado após a atualização
            }
        });
    }
    // 🗑️ Excluir um estabelecimento
    async deleteEstablishment(id) {
        await this.getEstablishmentById(id); // Valida existência
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