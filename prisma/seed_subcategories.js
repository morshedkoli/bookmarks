const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Sub-categories...');

    // 1. Get Categories
    const govCat = await prisma.category.findFirst({ where: { name: 'Government Services (BD)' } });
    const identityCat = await prisma.category.findFirst({ where: { name: 'Identity Documents' } });

    if (govCat) {
        // Create sub-categories for Gov
        await prisma.category.upsert({
            where: { name: 'Utility Bills' },
            update: { parentId: govCat.id },
            create: {
                name: 'Utility Bills',
                nameEn: 'Utility Bills',
                nameBn: 'ইউটিলিটি বিল',
                path: '/gov/utility',
                icon: '💡',
                description: 'Electricity, Gas, Water bill payment',
                password: 'Murshed@@@k5',
                parentId: govCat.id
            }
        });

        const eduCat = await prisma.category.upsert({
            where: { name: 'Education Board' },
            update: { parentId: govCat.id },
            create: {
                name: 'Education Board',
                nameEn: 'Education Board',
                nameBn: 'শিক্ষা বোর্ড',
                path: '/gov/education',
                icon: '🎓',
                description: 'Results and admissions',
                password: 'Murshed@@@k5',
                parentId: govCat.id
            }
        });

        // Move some sites if needed (Example placeholder)
    }

    // 2. We can also make Identity Documents a sub-category of Gov if desired, 
    // but user might want it separate. Let's keep structure flexible.

    console.log('Seeding Sub-categories finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
