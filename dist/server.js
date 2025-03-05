"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const app_1 = require("./app");
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3008;
app_1.app.listen(PORT, async () => {
    try {
        await prisma.$connect();
        console.log(`Server is running on http://localhost:${PORT}`);
    }
    catch (error) {
        console.error('❌ Error connecting to the database', error);
    }
});
//# sourceMappingURL=server.js.map