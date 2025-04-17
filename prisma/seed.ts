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
