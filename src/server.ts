import 'dotenv/config';
import { app } from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3004;

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log(`Server is running on http://localhost:${PORT}`);
});