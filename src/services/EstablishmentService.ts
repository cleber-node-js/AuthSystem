import { PrismaClient, Establishment } from '@prisma/client';

const prisma = new PrismaClient();

export class EstablishmentService {
  async createEstablishment(name: string, address: string | null, contact: string | null, primaryOwnerId: number): Promise<Establishment> {
    return await prisma.establishment.create({
      data: {
        name,
        address,
        contact,
        primaryOwnerId, // Atribua o ID do proprietário
      },
    });
  }

  async getEstablishmentById(id: number): Promise<Establishment | null> {
    return await prisma.establishment.findUnique({
      where: { id },
    });
  }

  async getAllEstablishments(): Promise<Establishment[]> {
    return await prisma.establishment.findMany();
  }

  async updateEstablishment(id: number, data: Partial<{ name: string; address: string; contact: string; primaryOwnerId: number }>): Promise<Establishment> {
    return await prisma.establishment.update({
      where: { id },
      data,
    });
  }

  async deleteEstablishment(id: number): Promise<Establishment> {
    return await prisma.establishment.delete({
      where: { id },
    });
  }
}