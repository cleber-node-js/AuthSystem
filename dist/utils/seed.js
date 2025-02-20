"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const roles = ['ADMIN', 'CLIENT'];
    for (const roleName of roles) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName },
        });
        console.log(`Created or updated role: ${role.name}`);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map