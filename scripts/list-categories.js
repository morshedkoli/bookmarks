const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listCategories() {
  try {
    console.log('Current categories in database:');
    
    const categories = await prisma.category.findMany({
      include: {
        websites: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. "${cat.name}" (${cat.websites.length} websites)`);
      console.log(`   Path: ${cat.path}`);
      console.log(`   Icon: ${cat.icon}`);
      console.log(`   Description: ${cat.description || 'No description'}`);
      console.log('');
    });
    
    console.log(`Total categories: ${categories.length}`);
    console.log(`Total websites: ${categories.reduce((sum, cat) => sum + cat.websites.length, 0)}`);
    
  } catch (error) {
    console.error('Error listing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listCategories();
