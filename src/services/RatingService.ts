import { PrismaClient, Rating } from '@prisma/client';

const prisma = new PrismaClient();

export class RatingService {
  // Cria uma nova classificação
  async createRating(eventId: number, userId: number, score: number, comment?: string): Promise<Rating> {
    return await prisma.rating.create({
      data: {
        eventId,
        userId,
        score,
        comment,
      },
    });
  }

  // Obtem todas as classificações
  async getAllRatings(): Promise<Rating[]> {
    return await prisma.rating.findMany({
      include: {
        user: true, // Inclui informações do usuário
        event: true  // Inclui informações do evento
      }
    });
  }

  // Obtem uma classificação por ID
  async getRatingById(id: number): Promise<Rating | null> {
    return await prisma.rating.findUnique({
      where: { id },
      include: {
        user: true,
        event: true
      }
    });
  }

  // Atualiza uma classificação
  async updateRating(id: number, eventId: number, userId: number, score: number, comment?: string): Promise<Rating> {
    return await prisma.rating.update({
      where: { id },
      data: {
        eventId,
        userId,
        score,
        comment,
      },
    });
  }

  // Deleta uma classificação
  async deleteRating(id: number): Promise<Rating> {
    return await prisma.rating.delete({
      where: { id },
    });
  }
}