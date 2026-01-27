
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function moveWebsitesAndDelete(sourceName, targetName) {
    console.log(`\n--- Merging "${sourceName}" into "${targetName}" ---`);

    const sourceCat = await prisma.category.findFirst({ where: { name: sourceName } });
    const targetCat = await prisma.category.findFirst({ where: { name: targetName } });

    if (!sourceCat) {
        console.log(`Source category "${sourceName}" not found. Skipping.`);
        return;
    }

    if (!targetCat) {
        console.log(`Target category "${targetName}" not found. Skipping.`);
        return;
    }

    console.log(`Source ID: ${sourceCat.id}, Target ID: ${targetCat.id}`);

    // Move websites
    const updateResult = await prisma.website.updateMany({
        where: { categoriesId: sourceCat.id },
        data: { categoriesId: targetCat.id }
    });

    console.log(`Moved ${updateResult.count} websites.`);

    // Delete source category
    try {
        await prisma.category.delete({ where: { id: sourceCat.id } });
        console.log(`Deleted source category "${sourceName}".`);
    } catch (e) {
        console.error(`Failed to delete "${sourceName}":`, e.message);
    }
}

async function main() {
    try {
        // 1. Merge "Artificial Inteligent" -> "AI & Content Tools"
        await moveWebsitesAndDelete('Artificial Inteligent', 'AI & Content Tools');

        // 2. Merge "PDF & Document Tools" -> "Online Business Tools"
        await moveWebsitesAndDelete('PDF & Document Tools', 'Online Business Tools');

        // 3. Cleanup "Birth Registration" -> "Government Services (BD)"
        // Note: The logic handles checking existence, so safe to run even if empty
        await moveWebsitesAndDelete('Birth Registration', 'Government Services (BD)');

        // 4. Cleanup "Online Payments" -> "Online Business Tools"
        await moveWebsitesAndDelete('Online Payments', 'Online Business Tools');

        // 5. Cleanup "Education Results" -> "Education Board" sub-category of Gov
        // Need to find target by name "Education Board"
        await moveWebsitesAndDelete('Education Results', 'Education Board');


    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
