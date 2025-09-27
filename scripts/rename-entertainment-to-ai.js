const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function renameEntertainmentToAI() {
  try {
    // Find the Entertainment category
    const entertainmentCategory = await prisma.categorie.findFirst({
      where: {
        OR: [
          { nameEn: { contains: 'Entertainment', mode: 'insensitive' } },
          { nameBn: { contains: 'বিনোদন', mode: 'insensitive' } }
        ]
      },
      include: {
        websites: true
      }
    });

    if (!entertainmentCategory) {
      console.log('Entertainment category not found');
      return;
    }

    console.log(`Found Entertainment category: ${entertainmentCategory.nameEn} (${entertainmentCategory.nameBn})`);
    console.log(`Current websites in this category: ${entertainmentCategory.websites.length}`);
    
    if (entertainmentCategory.websites.length > 0) {
      console.log('Websites:');
      entertainmentCategory.websites.forEach(site => {
        console.log(`  - ${site.name}: ${site.link}`);
      });
    }

    // Update the category to AI
    const updatedCategory = await prisma.categorie.update({
      where: {
        id: entertainmentCategory.id
      },
      data: {
        nameEn: 'Artificial Intelligence',
        nameBn: 'কৃত্রিম বুদ্ধিমত্তা',
        descriptionEn: 'AI tools, chatbots, and artificial intelligence platforms',
        descriptionBn: 'এআই টুলস, চ্যাটবট এবং কৃত্রিম বুদ্ধিমত্তা প্ল্যাটফর্ম',
        icon: '🤖' // Robot emoji for AI
      }
    });

    console.log('\n✅ Successfully renamed category!');
    console.log(`New name: ${updatedCategory.nameEn} (${updatedCategory.nameBn})`);
    console.log(`New icon: ${updatedCategory.icon}`);
    console.log(`Description: ${updatedCategory.descriptionEn}`);

  } catch (error) {
    console.error('Error renaming category:', error);
  } finally {
    await prisma.$disconnect();
  }
}

renameEntertainmentToAI();
