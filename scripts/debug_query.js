const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fetching all categories...");
    const all = await prisma.category.findMany();
    console.log(`Total categories: ${all.length}`);
    all.forEach(c => {
        console.log(`ID: ${c.id}, Name: ${c.name}, ParentId: ${c.parentId}, Typeof ParentId: ${typeof c.parentId}`);
    });

    console.log("\nFetching with where: { parentId: null }...");
    const roots = await prisma.category.findMany({
        where: { parentId: null }
    });
    console.log(`Root categories found: ${roots.length}`);
    roots.forEach(c => console.log(` - ${c.name}`));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
