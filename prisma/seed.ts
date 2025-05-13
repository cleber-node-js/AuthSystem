import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'admin' },
      { name: 'business' },
      { name: 'artist' },
      { name: 'client' },
      { name: 'user' },
      { name: 'guest' },
      { name: 'default' }
    ],
    skipDuplicates: true
  });

  await prisma.category.createMany({
    data: [
      {
        name: 'Agenda',
        imageUrl: 'https://res.cloudinary.com/dcqhbkvpb/image/upload/v1747139320/agender_jxfyei.png'
      },
      {
        name: 'Musica',
        imageUrl: 'https://res.cloudinary.com/dcqhbkvpb/image/upload/v1747139320/music_lnyv7m.png'
      },
      {
        name: 'Gastronomia',
        imageUrl: 'https://res.cloudinary.com/dcqhbkvpb/image/upload/v1747139320/gastromer_ujtktb.png'
      },
      {
        name: 'Cinema',
        imageUrl: 'https://res.cloudinary.com/dcqhbkvpb/image/upload/v1747139319/cinema_qv9xja.png'
      },
      {
        name: 'Artistas',
        imageUrl: 'https://res.cloudinary.com/dcqhbkvpb/image/upload/v1747139320/artistes_s14uqq.png'
      },
      {
        name: 'Esportes',
        imageUrl: 'https://res.cloudinary.com/dcqhbkvpb/image/upload/v1747144732/sports_yjq701.png'
      },
      {
        name: 'Outros',
        imageUrl: 'https://res.cloudinary.com/dcqhbkvpb/image/upload/v1747139320/other_tdlcye.png'
      }
    ],
    skipDuplicates: true
  })
  console.log("✅ Dados de seed inseridos!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
