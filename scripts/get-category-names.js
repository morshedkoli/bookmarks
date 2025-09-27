const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getCategoryNames() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        path: true,
        icon: true,
        websites: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log('Category names with website counts:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. "${cat.name}" (${cat.websites.length} websites)`);
    });
    
    // Find categories with non-English names
    console.log('\nCategories that need updating (non-English names):');
    const nonEnglishCategories = categories.filter(cat => 
      /[\u0980-\u09FF]/.test(cat.name) || // Bengali characters
      cat.name.includes('ভিসা') ||
      cat.name.includes('নিবন্ধন') ||
      cat.name.includes('পিডিএফ') ||
      cat.name.includes('রেজাল্ট') ||
      cat.name.includes('চালান')
    );
    
    nonEnglishCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ID: ${cat.id}, Name: "${cat.name}", Path: "${cat.path}", Websites: ${cat.websites.length}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getCategoryNames();
