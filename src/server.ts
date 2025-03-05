import { PrismaClient } from '@prisma/client';
import { app } from './app';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3008;

app.listen(PORT, async () => {
    try {
        await prisma.$connect();
        console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('❌ Error connecting to the database', error);
    }
});
