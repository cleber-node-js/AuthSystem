import { PrismaClient, Rating } from '@prisma/client';

const prisma = new PrismaClient();

export class RatingService {
  // Cria uma nova classificação
  async createRating(event_id: number, user_id: number, score: number, comment?: string): Promise<Rating> {
    return await prisma.rating.create({
      data: {
        event_id,
        user_id,
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
  async updateRating(id: number, event_id: number, user_id: number, score: number, comment?: string): Promise<Rating> {
    return await prisma.rating.update({
      where: { id },
      data: {
        event_id,
        user_id,
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