const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const all = await prisma.category.findMany();
    const result = {
        total: all.length,
        categories: all.map(c => ({
            id: c.id,
            name: c.name,
            parentId: c.parentId,
            typeOfParentId: typeof c.parentId
        })),
        roots: (await prisma.category.findMany({ where: { parentId: null } })).length,
        roots_missing: (await prisma.category.findMany({ where: { parentId: { isSet: false } } })).length
    };

    fs.writeFileSync('debug_data.json', JSON.stringify(result, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
