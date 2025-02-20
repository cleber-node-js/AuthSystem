"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstablishmentService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EstablishmentService {
    async createEstablishment(name, address, contact, primaryOwnerId) {
        return await prisma.establishment.create({
            data: {
                name,
                address,
                contact,
                primaryOwnerId, // Atribua o ID do proprietário
            },
        });
    }
    async getEstablishmentById(id) {
        return await prisma.establishment.findUnique({
            where: { id },
        });
    }
    async getAllEstablishments() {
        return await prisma.establishment.findMany();
    }
    async updateEstablishment(id, data) {
        return await prisma.establishment.update({
            where: { id },
            data,
        });
    }
    async deleteEstablishment(id) {
        return await prisma.establishment.delete({
            where: { id },
        });
    }
}
exports.EstablishmentService = EstablishmentService;
//# sourceMappingURL=EstablishmentService.js.map