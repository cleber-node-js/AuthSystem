"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3004;
app_1.app.listen(PORT, async () => {
    await prisma.$connect();
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map